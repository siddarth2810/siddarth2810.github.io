export type Experience = {
        company: string;
        icon: string;
        role: string;
        summary: string;
};

export const experiences: Experience[] = [
        {
                company: "Cortex (CNCF Incubating)",
                icon: "/cortex.svg",
                role: "Triage Team",
                summary: "Part of Cortex team as triager, collaborating with Cortex maintainers on reviews, issue triage, and improvements.",
        },
        {
                company: "Tower Cloud",
                icon: "/tower.svg",
                role: "Software Engineer",
                summary:
                        "Built entire observability stack across the platform. Improved auth flows with Keycloak JWT verification, deployed Percona DBs on Kubernetes, and automated backup and restore workflows.",
        },
        {
                company: "The Linux Foundation",
                icon: "/linux_foundation.webp",
                role: "Linux Kernel Mentee",
                summary:
                        "Contributed patches to the upstream Linux kernel while working with maintainers. "
        },
];
