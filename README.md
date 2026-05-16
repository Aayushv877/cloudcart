# CloudCart — Production-Ready AWS Cloud Migration Project

## Overview

CloudCart is a production-style cloud-native multi-vendor e-commerce platform deployed on AWS using modern DevOps and cloud architecture practices.

This project demonstrates how to migrate and deploy a containerized full-stack application using AWS managed services including ECS Fargate, RDS PostgreSQL, Application Load Balancer, CloudFront CDN, ElastiCache Redis, WAF, S3, and CloudWatch.

The architecture is designed to simulate a real enterprise deployment environment with scalability, monitoring, security, load balancing, and container orchestration.

---

# Project Goals

* Deploy frontend and backend applications using Docker containers
* Run containers on AWS ECS Fargate
* Use PostgreSQL database on Amazon RDS
* Configure Application Load Balancer for traffic routing
* Use CloudFront as global CDN
* Implement Redis caching using ElastiCache
* Configure AWS WAF for security protection
* Store assets using Amazon S3
* Monitor logs and metrics using CloudWatch
* Implement scalable and production-ready cloud architecture

---

# Tech Stack

## Frontend

* Next.js
* React.js
* JavaScript
* CSS

## Backend

* Node.js
* Express.js
* REST APIs

## Database

* PostgreSQL (Amazon RDS)

## Caching

* Redis (Amazon ElastiCache)

## DevOps & Cloud

* Docker
* Docker Compose
* AWS ECS Fargate
* Amazon ECR
* Application Load Balancer
* Amazon CloudFront
* Amazon S3
* AWS WAF
* Amazon CloudWatch
* AWS VPC
* AWS Security Groups

---

# AWS Services Used

| Service                     | Purpose                                 |
| --------------------------- | --------------------------------------- |
| Amazon ECS Fargate          | Run containers without managing servers |
| Amazon ECR                  | Store Docker container images           |
| Amazon RDS PostgreSQL       | Managed relational database             |
| Elastic Load Balancer (ALB) | Distribute traffic to containers        |
| Amazon CloudFront           | Content delivery network                |
| Amazon S3                   | Static storage and assets               |
| Amazon ElastiCache Redis    | Application caching                     |
| AWS WAF                     | Web application firewall                |
| Amazon CloudWatch           | Logs and monitoring                     |
| AWS VPC                     | Secure networking                       |
| Security Groups             | Firewall rules                          |

---

# Architecture Flow

```text
User Request
     ↓
CloudFront CDN
     ↓
AWS WAF
     ↓
Application Load Balancer
     ↓
ECS Fargate Frontend Container
     ↓
Backend API Container
     ↓
RDS PostgreSQL + Redis Cache
```

---

# Key Features

## Cloud-Native Deployment

* Fully containerized architecture
* Stateless frontend deployment
* Managed infrastructure using AWS services

## High Availability

* ECS Fargate auto manages infrastructure
* Load balancer distributes incoming traffic
* Multi-AZ capable database deployment

## Security

* AWS WAF protection
* Security Groups configuration
* Isolated VPC networking
* Controlled inbound/outbound traffic

## Scalability

* ECS service scaling support
* CDN caching using CloudFront
* Redis caching for faster responses

## Monitoring & Observability

* CloudWatch logs
* ECS task monitoring
* Health checks using ALB target groups

---

# Docker Setup

## Build Frontend Container

```bash
cd cloudcart-frontend

docker build -t cloudcart-frontend .
```

## Build Backend Container

```bash
cd cloudcart-backend

docker build -t cloudcart-backend .
```

## Run with Docker Compose

```bash
docker compose up --build
```

---

# ECS Deployment Workflow

## Step 1 — Push Docker Images to Amazon ECR

* Create ECR repositories
* Authenticate Docker with ECR
* Push frontend and backend images

## Step 2 — Create ECS Task Definitions

* Configure frontend task
* Configure backend task
* Define CPU and memory
* Configure container ports

## Step 3 — Create ECS Cluster

* Launch ECS cluster
* Use Fargate launch type

## Step 4 — Create ECS Services

* Deploy frontend service
* Deploy backend service
* Attach load balancer

## Step 5 — Configure Application Load Balancer

* Create ALB listener
* Configure target groups
* Attach ECS services

## Step 6 — Configure CloudFront CDN

* Create CloudFront distribution
* Connect ALB as origin

## Step 7 — Configure WAF

* Create Web ACL
* Attach to CloudFront

## Step 8 — Configure CloudWatch Logs

* Enable ECS container logging
* Monitor task activity

---

# Database Configuration

## Amazon RDS PostgreSQL

Features:

* Managed PostgreSQL database
* Automated backups
* Security group protection
* Persistent storage

---

# Redis Configuration

## Amazon ElastiCache Redis

Features:

* In-memory caching
* Faster API responses
* Reduced database load
* Improved scalability

---

# Security Configuration

## Security Groups

### ALB Security Group

| Protocol | Port | Source    |
| -------- | ---- | --------- |
| HTTP     | 80   | 0.0.0.0/0 |
| HTTPS    | 443  | 0.0.0.0/0 |

### ECS Security Group

| Protocol | Port | Source             |
| -------- | ---- | ------------------ |
| TCP      | 3000 | ALB Security Group |
| TCP      | 5000 | ALB Security Group |

### RDS Security Group

| Protocol   | Port | Source             |
| ---------- | ---- | ------------------ |
| PostgreSQL | 5432 | ECS Security Group |

---

# Monitoring & Logging

## CloudWatch

Used for:

* ECS container logs
* Application debugging
* Monitoring deployments
* Health check visibility

---

# Challenges Solved

During deployment, several production-level issues were identified and resolved:

* ECS task failures
* ALB target registration issues
* Incorrect listener configuration
* Security group misconfiguration
* Target group port mismatches
* Health check failures
* CloudFront timeout errors
* ECS service attachment issues

These troubleshooting steps improved understanding of real-world AWS production environments.

---

# Project Learnings

This project helped build hands-on experience in:

* AWS cloud architecture
* Container orchestration
* Load balancing
* Cloud networking
* Managed databases
* CDN integration
* Security best practices
* Monitoring and observability
* Cloud troubleshooting
* Production deployment workflows

---

# Future Improvements

Potential future enhancements:

* CI/CD using GitHub Actions
* Infrastructure as Code using Terraform
* HTTPS using ACM certificates
* Auto Scaling policies
* Multi-region deployment
* Kubernetes migration using EKS
* API Gateway integration
* Authentication and authorization

---

# Project Screenshots

Add screenshots here:

* ECS Services
* ECS Tasks
* Application Load Balancer
* CloudFront Distribution
* RDS Database
* Redis Cluster
* CloudWatch Logs
* Working Application UI

---

# Resume Highlights

This project demonstrates:

* AWS Solution Architect level concepts
* Cloud-native deployment architecture
* Production-grade AWS infrastructure
* Containerized application deployment
* High availability architecture
* Monitoring and troubleshooting skills

---

# Author

Aayush Vishwakarma

Cloud & DevOps Enthusiast

---

# License

This project is created for educational and portfolio purposes.
