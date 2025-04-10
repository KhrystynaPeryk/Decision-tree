// this file contains mapping by the keys, which is a combination of selected final options ("name" in data.json joined using a pipe)
export const articleMapping = {
    // Cloud Hosting → AKS Hosting branch
    "cloud hosting|AKS hosting|auto-scaling|high availability": {
    title: "Cloud Hosting with AKS, Auto-Scaling, and High Availability",
    markdown: `
### Optimized Cloud Hosting

Your choices indicate a robust cloud solution that leverages **AKS**, supports **auto-scaling**, and ensures high availability for mission-critical applications.

* **Scalability:** Automatically adjust to load.
* **Reliability:** High uptime with redundant systems.

[Read more for detailed insights...](https://example.com/details)
`
},
    "cloud hosting|AKS hosting|auto-scaling": {
        title: "Cloud Hosting with AKS and Auto-Scaling",
        markdown:
        "Your selection leverages auto-scaling to adapt to varying workloads using AKS hosting."
    },
    "cloud hosting|AKS hosting": {
        title: "Basic Cloud Hosting with AKS",
        markdown:
        "A straightforward cloud hosting setup with AKS, offering essential features without extra bells and whistles. [Read more for detailed insights...](https://example.com/details)"
    },

    // Cloud Hosting → CM Hosting branch
    "cloud hosting|CM Hosting|auto-scaling|managed services": {
        title: "Cloud Hosting with CM, Auto-Scaling, and Managed Services",
        markdown:
        "You opted for a CM Hosting solution enhanced with auto-scaling and managed services for a more seamless experience."
    },
    "cloud hosting|CM Hosting|auto-scaling": {
        title: "Cloud Hosting with CM and Auto-Scaling",
        markdown:
        "An advanced setup with CM Hosting that takes advantage of auto-scaling to meet dynamic demands."
    },
    "cloud hosting|CM Hosting": {
        title: "Basic Cloud Hosting with CM",
        markdown:
        "A simple and cost-effective CM Hosting solution without additional auto-scaling or managed services."
    },

    // Subscription branch
    "subscription|monthly|a discount for a longer commitment": {
        title: "Monthly Subscription with Annual Discount Option",
        markdown:
        "This option offers the flexibility of a monthly subscription with the opportunity to switch to an annual discount plan."
    },
    "subscription|monthly": {
        title: "Standard Monthly Subscription",
        markdown:
        "A straightforward monthly subscription ideal for short-term commitments."
    },
    "subscription|annual|add additional support services|basic support level": {
        title: "Annual Subscription with Basic Support",
        markdown:
        "An annual subscription that includes additional basic support services, ensuring reliable assistance."
    },
    "subscription|annual|add additional support services|premium support level": {
        title: "Annual Subscription with Premium Support",
        markdown:
        "Enjoy an annual subscription that comes with premium support services for top-notch assistance."
    },
    "subscription|annual": {
        title: "Standard Annual Subscription",
        markdown:
        "A classic annual subscription without extra support services, ideal for steady, long-term needs."
    },

    // Dedicated Server branch
    "dedicated server|bare metal|a high-performance CPU": {
        title: "Dedicated Bare Metal Server with High-Performance CPU",
        markdown:
        "This dedicated bare metal server is optimized with a high-performance CPU, perfect for demanding workloads."
    },
    "dedicated server|bare metal": {
        title: "Dedicated Bare Metal Server",
        markdown:
        "A reliable bare metal server designed for dedicated use, offering robust performance."
    },
    "dedicated server|Virtual Private Server (VPS) sfgawesgwegwegwegw wefqwf qwefqw fqwef qwefqwef qwf wefwef wefwe|automatic backups": {
        title: "Dedicated VPS with Automatic Backups",
        markdown:
        "Your VPS configuration includes automatic backups to enhance data security and recovery."
    },
    "dedicated server|Virtual Private Server (VPS) sfgawesgwegwegwegw wefqwf qwefqw fqwef qwefqwef qwf wefwef wefwe": {
        title: "Dedicated VPS Server",
        markdown:
        "This dedicated VPS offers a flexible hosting environment, ideal for scaling applications as needed."
    }
};
 