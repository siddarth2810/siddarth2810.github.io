---
title: "TSDB to Parquet"
pubDate: 2026-05-28
tags: ["Parquet", "Open source"]
draft: false
---

I've been reading a LOT of articles lately and I think this gave me an intense urge to write something. I've decided that writing is one of those skills which I really want to get good at.

I've been working on **Cortex Metrics:** It's a CNCF project for long term storage solution for Prometheus. I thought it would be cool to write something about my recent work.

I've been working on issues related to converting TSDB into  Parquet file format. I'll explain about TSDB first

## What's a Series ?

If you worked with Prometheus you must have come across something like this

```
http_requests_total{instance="1",method="GET"}
```

Now this is a called as a **Series**. When you query it in Prometheus, you get some samples.

Samples are basically key value pairs of timestamp and numbers.

```
10:00 -> 5
10:01 -> 7
10:02 -> 9
```

## Converting Series into TSDB

There can be millions and millions of sample data. Directly storing them is really expensive. So, Prometheus compresses them into chunks.

I won't go deep into how it's done. [Prometheus format docs](https://github.com/prometheus/prometheus/blob/main/tsdb/docs/format/README.md) is a great place to learn more about it.

```text
Series:
  __name__ = http_requests_total
  tenant   = tenant_a
  job      = api
  method   = GET
  status   = 200

Chunks:
  Chunk 1 -> samples from 10:00 to 10:30
  Chunk 2 -> samples from 10:30 to 11:00
```

A TSDB block stores many such series. At a high level, a block looks like this:
```
01HXYZ.../
├── meta.json
├── index          ← all series + where their chunks are
├── chunks/
│   └── 000001     ← actual compressed samples
└── tombstones
```


## Parquet Format

In traditional **SQL** database the data is stored row by row:

```text
row 1: tenant_a, http_requests_total, api, 200
row 2: tenant_a, http_requests_total, api, 500
row 3: tenant_b, cpu_usage, worker, null
```

If you want to read only the `status` column for all rows, you still have to scan every row and skip over the other columns. That’s inefficient.

A Parquet file format was introduced by Apache. It's really efficient for querying large datasets because it uses **columner** format.

Conceptually, parquet layout is like this:

```
column tenant:
  tenant_a
  tenant_a
  tenant_b

column __name__:
  http_requests
  http_requests
  cpu_usage

column job:
  api
  api
  worker

column status:
  200
  500
  null
```

## Conclusion

```text
TSDB series labels
        ↓
Parquet columns
```

The use of Parquet in observability was inspired from Shopify's engineering team. This video is really cool ! [Deep dive into long term metrics for planet-scale commerce, with Filip Petkovski](https://youtu.be/V8Y4VuUwg8I?si=b-eoa9XWosFyP-I_)

Fun fact: ClickHouse too uses columnar format under the hood :)
