# 🚀 DashHub: The Unified Open-Source AI Platform for Enterprises

Empower Your Enterprise AI Journey with **Seamless Integration** ⚙️, **Unmatched Flexibility** 🔄, and **Enterprise-Grade Security** 🔐, all backed by **Community-Driven Innovation** 🌐

**DashHub** is the AI platform designed to make cutting-edge technology more **affordable** 💰, **faster** to implement ⏩, and **safer** 🔒 for enterprises of all sizes. With DashHub, you can seamlessly integrate the latest AI innovations while using your own storage and API keys from leading GenAI providers, giving you complete control and flexibility. Our open-source platform offers **tailored, plug-and-play solutions** that evolve with your needs, **eliminating complexity** and **reducing costs** 💡. DashHub ensures **secure**, **vendor-agnostic AI adoption**, allowing teams to **collaborate** 🤝 and **innovate** effortlessly 💻. Whether you're enhancing productivity or driving creativity, DashHub is the **smarter**, more **cost-effective** way to harness AI.

At DashHub, we believe tools should adapt to **your needs and use cases**, offering a seamless, flexible AI experience that empowers you to **work smarter** 🚀, without changing the way you already succeed.

## 📋 Table of Contents

- [🚀 DashHub: The Unified Open-Source AI Platform for Enterprises](#-dashhub-the-unified-open-source-ai-platform-for-enterprises)
  - [📋 Table of Contents](#-table-of-contents)
  - [🌟 Introduction](#-introduction)
  - [🌟 Why Choose DashHub](#-why-choose-dashhub)
  - [Setup ⚙️](#setup-️)
  - [Migrations ⚙️](#migrations-️)
  - [Elasticsearch](#elasticsearch)
  - [Deployment 🚀](#deployment-)
  - [👥 User Roles and Permissions](#-user-roles-and-permissions)
  - [🔑 Key Features](#-key-features)
    - [Projects 📂](#projects-)
    - [Experts 🧠](#experts-)
    - [Applications 📱](#applications-)
    - [Knowledge Management 📚](#knowledge-management-)
  - [🚀 MVP Phase](#-mvp-phase)
  - [📈 Future Plans - feel free to contribute! 🤘](#-future-plans---feel-free-to-contribute-)
  - [🔄 Integration Process](#-integration-process)
  - [🏗️ Technical Architecture](#️-technical-architecture)
  - [🔒 Security and Compliance](#-security-and-compliance)
  - [⚠️ Limitations and Considerations](#️-limitations-and-considerations)
  - [📄 License](#-license)
  - [🤝 Contributing](#-contributing)

## 🌟 Introduction

Welcome to **DashHub**, your ultimate solution for seamless AI integration. Our platform empowers users to effortlessly integrate, manage, and utilize **Large Language Models (LLMs)** and **Generative AI (GenAI)** solutions within any environment. We aim to simplify AI adoption, making it **accessible**, **safe**, **efficient**, and **cost-effective** for everyone.

## 🌟 Why Choose DashHub

- **Unified Interface for All GenAI Solutions**
  - Access multiple AI models and providers like Midjourney, Gemini, OpenAI, and more through a single, intuitive platform.
- **Cost-Effective**
  - Pay for usage, not per account. Gain access to the latest and most specialized models without multiple subscriptions.
- **Custom AI Experts**
  - Create and manage AI-powered Experts tailored to specific functions, deployable across your entire organization.
- **Fast and Easy Implementation**
  - Get up and running quickly with minimal setup, suitable for both individuals and enterprises.
- **Project Collaboration**
  - Organize work into projects with shared knowledge bases and team collaboration features.
- **Context Preservation**
  - Maintain conversation history and data consistency across different AI models.
- **Secure Access Control**
  - Role-based permissions and authentication for enhanced security.
- **Flexible Deployment**
  - Deploy DashHub locally or in the cloud to suit your infrastructure.

## Setup ⚙️

To run the project, follow these steps:

1. Clone the repository by running the following command:

  ```
  git clone https://github.com/dashhub-org/dashhub.git
  ```

2. Install the required dependencies by running the following command:

  ```bash
  yarn install
  ```

3. Start the project by running the following command:

  ```
  yarn run dev
  ```

After executing these commands, the project should start running and you can access it through your web browser.

## Migrations ⚙️

To run the migrations, follow these steps:

  ```bash
  cd apps/backend
  yarn run db:migrate
  ```

To rollback the migrations, follow these steps:

  ```bash
  cd apps/backend
  yarn run db:migrate --down
  ```

## Elasticsearch

To reindex all the data in Elasticsearch, run the following command:

  ```bash
  yarn run es:reindex:all
  ```

## Deployment 🚀

To deploy the project to the **staging** environment, run the following command:

```bash
git push origin main:hetzner/staging
```

To deploy the project to the **production** environment, use the following command:

```bash
git push origin main:hetzner/production
```

## 👥 User Roles and Permissions

The platform supports three types of users:

1. **Admin**
   - Add new users to the system
   - Manage user permissions
2. **Tech Users**
   - Add and manage new Experts
   - Manage LLM integrations
   - Configure storage solutions
   - Manage Applications
3. **Users (Employees)**
   - Interact with general chat interfaces
   - Create and manage projects
   - Invite team members to projects
   - Utilize Experts within projects
   - Use Applications for specific tasks

## 🔑 Key Features

### Projects 📂

- **Dedicated Spaces**: Create projects with custom knowledge bases and settings.
- **Collaboration**: Invite team members and work together in one space.
- **History Preservation**: Maintain chat history and context within each project.

### Experts 🧠

- **Custom AI Assistants**: Develop AI Experts specialized for specific tasks.
- **Organization-Wide Access**: Manage and deploy Experts across your entire organization.
- **Knowledge Integration**: Utilize project-specific information to enhance AI interactions.

### Applications 📱

- **Task-Specific Tools**: Create small LLM applications for specific operations (e.g., email rewriting, data structuring).
- **Reusable Components**: Use Applications across different projects for efficiency.

### Knowledge Management 📚

- **Knowledge Bases**: Users can add outputs to project knowledge bases.
- **Export Options**: Download and export information as needed.

## 🚀 MVP Phase

The Minimum Viable Product (MVP) includes the following features:

- **Web-Based User Interface**
- **User Management**: Admin, Tech User, User roles, plus SaaS admin to create Admin/org accounts.
- **Project Creation and Management**
- **Pre-Configured Experts**: Four experts with custom instructions.
- **Only AWS Storage Integration**
- **Primary LLM Provider**: ChatGPT 4o mini
- **No LLM Provider Selection**
- **Basic Chat Functionality**

**Limitations in the MVP:**

- No mid-conversation LLM provider switching.
- Limited number of pre-configured Experts.
- Single storage provider (AWS).

## 📈 Future Plans - feel free to contribute! 🤘

Planned enhancements for future versions include:

- **Integration with Other AI Services**: Claude, LLama, Gemini, Perplexity, Runway, Midjourney, Hugging Face and more.
- **Expanded Storage Options**: Support for Azure, Google Cloud, local storage and more.
- **Multi-Language Support**: Interface and AI interactions in multiple languages.
- **Enterprise Tool Integrations**: Slack, Microsoft 365, Salesforce, Google Workspace, Box, Zoho Docs, etc.
- **Cross-AI Analytics and Reporting**
- **Enterprise-Level Security**: Single Sign-On
- **Advanced Expert Creator**: Enhanced capabilities with agent systems.
- **Enhanced Security and Compliance**: GDPR, HIPAA compliance, and advanced enterprise security features.

## 🔄 Integration Process

Getting started with DashHub is simple:

1. **Sign Up**: Create an account.
2. **Invite Users**: Add team members and assign roles.
3. **Add LLM API Credentials**: (Simulated in MVP)
4. **Configure Storage Solution**: AWS in MVP; more options coming soon.
5. **Customize**: Upload your company logo and settings.
6. **Start Creating**: Start using and enjoy the newest AI developments in a save enviroment.

## 🏗️ Technical Architecture

The platform is designed as a web application with the following key components:

- **Frontend**: Responsive web interface
- **Backend**: API-driven architecture
- **Storage**: Client-side data storage (AWS in MVP, expandable in future)
- **AI Integration**: API-based connections to AI providers
- **Security**: Enterprise-grade security measures (to be expanded in future versions)

## 🔒 Security and Compliance

While the MVP focuses on core functionality, future versions will address advanced security and compliance requirements, potentially including:

- **GDPR Compliance**
- **HIPAA Compliance**
- **SOC 2 Certification**
- **End-to-End Encryption**
- **Advanced Access Controls**
- **Audit Logging**

## ⚠️ Limitations and Considerations

- **Simulated Features**: Some features are simulated in the MVP to demonstrate future capabilities.
- **LLM Provider Switching**: Not supported mid-conversation in the MVP.
- **LLM Capabilities**: The platform acts as an aggregator and does not provide its own LLM capabilities.
- **Model Fine-Tuning**: Not handled by the platform; clients can connect their own fine-tuned models.
- **Data Scaling**: For medium and large users - primarily handled on the client side due to the use of client storage solutions.

## 📄 License

DashHub is released under the [Apache License 2.0](LICENSE), promoting openness and collaboration while providing protections for contributors.

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before you start.

- **Report Bugs**: Use the [Issue Tracker](https://github.com/dashhub-org/dashhub/issues) to report bugs.
- **Suggest Features**: Open a feature request in the Issue Tracker.
- **Submit Pull Requests**: Follow our guidelines and submit your improvements.

Join us in shaping the future of AI integration. Together, we can make AI more accessible and beneficial for all.

This documentation will be updated as the product evolves, new features are added, and additional capabilities are introduced.
