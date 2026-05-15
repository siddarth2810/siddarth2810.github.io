export type Experience = {
  company: string;
  icon: string;
  role: string;
  summary: string;
};

export const experiences: Experience[] = [
  {
    company: "Tower Cloud",
    icon: "/tower.webp",
    role: "Software Engineer",
    summary:
      "Building observability and platform infrastructure across the cloud stack. Redesigned auth flows with Keycloak JWT verification, deployed Percona PostgreSQL on Kubernetes, and automated backup and restore workflows with Velero.",
  },
  {
    company: "The Linux Foundation",
    icon: "/linux_foundation.webp",
    role: "Linux Kernel Mentee",
    summary:
      "Contributed patches to the upstream Linux kernel while working with maintainers. Used Syzkaller, Smatch, and Coccinelle to reproduce bugs, analyze reports, and validate fixes.",
  },
];
