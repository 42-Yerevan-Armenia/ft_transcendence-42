# ft_transcendence-42

## Table of Contents
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Modules](#modules)
    - [Web](#web)
    - [User](#user)
    - [Game](#game)
    - [IA-Algo](#ia-algo)
    - [Cybersecurity](#cybersecurity)
    - [Devops](#devops)
    - [Gaming](#gaming)
    - [Graphics](#graphics)
    - [Accessibility](#accessibility)
    - [OOP](#oop)

## Introduction

The project will be divided into `16 major` and `11 minor` modules. To get 100 points, you need to complete `7 major` modules, note that `2 minor modules = 1 major module`. Modules will represent properties or additional features that your project can have. In other words, you will not be required to do all the modules, you can choose some of them.

Examples of modules are using a framework in the backend or frontend, giving your users additional features related to the game, making the program available for all devices, or using 3D techniques.

## Installation

You need to install Django, Python, PostgreSQL, Docker with their last versions.

Activate `virtualenv` and install Django

- python3 -m venv venv
- . venv/bin/activate
- pip install django (for first time)
- django-admin version (check)

In VSCode add extensions.

- REST Client
- Live Server

Change Docker directory.

`Preferences - Resources - Disk image location - /goinfree/DockerDesktop`

Run django server.

```python3 manage.py runserver```

## Modules

### Web
- Major module: Use a Framework as backend. `Aram`

In this major module, you are required to utilize a specific web framework for your backend development, and that framework is Django. Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design. It takes care of much of the hassle of web development, so you can focus on writing your app without needing to reinvent the wheel. For more information, visit the [Django]("https://docs.djangoproject.com/en/5.0/")

- Minor module: Use a database for the backend. `Aram`

The designated database for all DB instances in your project is PostgreSQL. PostgreSQL is a powerful, open-source object-relational database system with over 30 years of active development that has earned it a strong reputation for reliability, feature robustness, and performance. This choice guarantees data consistency and compatibility across all project components and may be a prerequisite for other modules, such as the backend Framework module. For more information, visit the [PostgreSQL]("https://www.postgresql.org/docs/")

In this project, we created a Docker image to manage PostgreSQL using PgAdmin. PgAdmin is a web-based GUI tool designed to manage PostgreSQL databases. It allows you to perform various database operations easily and provides a user-friendly interface for interacting with your database. For more information, visit the [PgAdmin]("https://www.pgadmin.org/docs/")

### User
- Major module: Standard user management, authentication, users across tournaments. `Aram` `Hovo`

This module ensures comprehensive user management and authentication, along with features for user interaction and profile customization. Key features and objectives include:

- `User Registration:` Users can subscribe to the website in a secure way.
- `Secure Login:` Registered users can log in securely.
- `Display Names:` Users can select a unique display name to participate in tournaments.
- `Profile Updates:` Users can update their information.
- `Avatars:` Users can upload an avatar, with a default option available if none is provided.
- `Friends List:` Users can add others as friends and view their online status.
- `User Stats:` User profiles display statistics such as wins and losses.
- `Match History:` Each user has a match history including 1v1 games, dates, and relevant details, accessible to logged-in users.

- Major module: Implementing a remote authentication. `Aram` `Hovo`

In this major module, the goal is to implement an OAuth 2.0 authentication system with 42. Key features and objectives include:

- `Duplicate Management:` Handle duplicate usernames/emails at your discretion, with a provided justification.
- `Secure Integration:` Integrate the authentication system, allowing users to securely sign in.
- `Credentials and Permissions:` Obtain the necessary credentials and permissions from the authority to enable secure login.
- `User-Friendly Flows:` Implement user-friendly login and authorization flows that adhere to best practices and security standards.
- `Secure Token Exchange:` Ensure the secure exchange of authentication tokens and user information between the web application and the authentication provider.

This major module aims to achieve remote user authentication, providing users with a secure and convenient way to access the web application.

### Gameplay and user experience
- Major module: Remote players `Vahan` `Aram` `Hovo`

This module allows for two distant players to engage in a Pong game. Each player is on a separate computer, accessing the same website and playing the game remotely. Network issues such as unexpected disconnection or lag must be considered. If a user disconnects or drops out from the server, they lose the game, and their opponent is declared the winner.

- Major module: Multiple players `Vahan` `Aram` `Hovo`

This module extends the gameplay to accommodate more than two players. Each player requires live control, making the "Remote players" module highly recommended. The game can be configured for 2, 4, or 8 players, with each player having their own control. For instance, in a 4-player game, each player can occupy one unique side of a squared board.

- Major module: Live chat. `Polina` `Aram` `Hovo`

This module involves creating a chat system for users with the following features:

- `Direct Messaging:` Users should be able to send direct messages to other users.
- `User Blocking:` Users should be able to block other users, preventing them from receiving further messages from the blocked account.
- `Game Invitations:` Users should be able to invite other users to play a Pong game through the chat interface.
- `Tournament Notifications:` The tournament system should be able to notify users about their upcoming games.
- `Profile Access:` Users should be able to access other players' profiles through the chat interface.

*Note: This part of the project is not yet complete and is approximately 70% finished. It is not counted as a module for project success.*

### IA-Algo
- non

### Cybersecurity
- Major module: Implement Two-Factor Authentication (2FA) and JWT. `Aram` `Hovo`

In this major module, the goal is to enhance security and user authentication by introducing Two-Factor Authentication (2FA) and utilizing JSON Web Tokens (JWT). Key features and objectives include:

- `Two-Factor Authentication (2FA):` Implement 2FA as an additional layer of security for user accounts, requiring users to provide a secondary verification method, such as a one-time code, in addition to their password. For more information, visit the [2FA]("https://www.contentstack.com/docs/developers/security/two-factor-authentication").
- `JSON Web Tokens (JWT):` Utilize JWT as a secure method for authentication and authorization, ensuring that user sessions and access to resources are managed securely. For more information, visit the [JWT]("https://jwt.io/").
- `User-Friendly Setup:` Provide a user-friendly setup process for enabling 2FA, with options for SMS codes, authenticator apps, or email-based verification.
- `Secure Token Management:` Ensure that JWT tokens are issued and validated securely to prevent unauthorized access to user accounts and sensitive data.

### Devops
- Major module: Designing the Backend as Microservices. `Aram` `Hovo`

In this major module, the goal is to architect the backend of the system using a microservices approach. Key features and objectives include:

- `Microservices Architecture:` Divide the backend into smaller, loosely-coupled microservices, each responsible for specific functions or features. This approach enhances modularity and allows for independent development and deployment.
- `Clear Boundaries and Interfaces:` Define clear boundaries and interfaces between microservices to enable independent development, deployment, and scaling. This helps in managing complex systems more effectively.
- `Communication Mechanisms:` Implement communication mechanisms between microservices, such as [RESTful APIs]("https://www.django-rest-framework.org/") or message queues, to facilitate data exchange and coordination. This ensures smooth interaction between different services.
- `Single Responsibility:` Ensure that each microservice is responsible for a single, well-defined task or business capability. This promotes maintainability and scalability, making it easier to update or replace individual components without affecting the entire system.

This major module aims to enhance the system’s architecture by adopting a microservices design approach, enabling greater flexibility, scalability, and maintainability of the backend components.

### Gaming
- non

### Graphics
- non

### Accessibility
- Minor module: Support on all devices. `Hovo`

In this module, the main focus is to ensure that your website works seamlessly on all types of devices. Key features and objectives include:

- `Responsive Design:` Make sure the website is responsive, adapting to different screen sizes and orientations. This ensures a consistent user experience on desktops, laptops, tablets, and smartphones. For more information on responsive design, visit [MDN Web Docs on Responsive Design]("https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design").
- `Input Method Compatibility:` Ensure that users can easily navigate and interact with the website using different input methods, such as touchscreens, keyboards, and mice, depending on the device they are using. This enhances usability across various devices.

This module aims to provide a consistent and user-friendly experience on all devices, maximizing accessibility and user satisfaction.

### OOP
- non

## Useful Links
[Python]("https://docs.python.org/3/using/index.html")
[JavaScript]("https://developer.mozilla.org/en-US/docs/Web/JavaScript")
[Docker]("https://docs.docker.com/")
[Figma]("https://www.figma.com/design/DFG7cTMdRkDayvyxDydONW/Pong-Game-Website-(Community)?node-id=0-1")
