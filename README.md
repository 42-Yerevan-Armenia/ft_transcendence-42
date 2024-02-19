# ft_transcendence-42

## Table of Contents
1. [Installation](#installation)
2. [FrontEnd](#frontend)
    - [Figma](#figma)
3. [BackEnd](#backend)
4. [Modules](#modules)
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

- Major 11
- Minor 4

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

`Preferences - Resources - Disk image location - /iSCSI/DockerDesktop`

Run django server.

```python3 manage.py runserver```

## FrontEnd

Install nvm only one time 
- 1)curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
- 2)npm install node
- 3)
export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
- 4)nvm install node
- 5)nvm install node --reinstall-packages-from=node

### Figma

Web Designe

- pages
- buttons

## BackEnd

- non

## Modules

### Web

- Major module: Use a Framework as backend. `Aram`
- Minor module: Use a database for the backend. `Aram`

### User

- Major module: Standard user management, authentication, users across
tournaments. `Aram` `Hovo`
- Major module: Implementing a remote authentication. `Aram` `Hovo`

### Game

- Major module: Remote players `Vahan` `Aram` `Hovo`
- Major module: Multiple players `Vahan` `Aram` `Hovo`
- Major module: Add Another Game with User History and Matchmaking. `Vahan` `Aram` `Hovo`
- Major module: Live chat. `Vlad` `Aram` `Hovo`
- Minor module: Game Customization Options. `Hovo`

### IA-Algo

- Minor module: User and Game Stats Dashboards. `Aram` `Hovo`

### Cybersecurity

- Major module: Implement Two-Factor Authentication (2FA) and JWT. `Vahe` `Aram`

### Devops

- Major module: Infrastructure Setup for Log Management. <?>
- Major module: Designing the Backend as Microservices. `Aram` `Hovo`

### Gaming

- Major module: Add Another Game with User History and Matchmaking. `Vahan` `Aram`
- Minor module: Game Customization Options. `Vahan`

### Graphics

- non

### Accessibility

- Minor module: Support on all devices. `Hovo`
- Minor module: Multiple language supports. <?>

### OOP

- Major module: Replacing Basic Pong with Server-Side Pong and Implementing an API. <?>
- Major module: Enabling Pong Gameplay via CLI against Web Users with API
Integration. <?>
