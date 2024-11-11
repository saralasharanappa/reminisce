[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/DIHvCS29)

# Reminisce

Reminisce is a full-stack social media application designed to capture and share life's most memorable moments. Built on the MERN stack, this platform allows users from around the world to create and explore albums of memories, showcasing notable places visited and adventures experienced.

## Features

### Authentication
- Secure user registration and login system
- JWT (JSON Web Token) implementation for enhanced security
- Google OAuth integration for seamless sign-in options

### Memory Management
- Create, read, update, and delete memories
- Rich text editor for detailed memory descriptions
- Image upload functionality for visual storytelling

### Search and Filtering
- Advanced search capabilities to find memories by tags (e.g., "Europe")
- Title-based search functionality
- Filter memories based on various criteria

### Pagination
- Efficient loading of memories through pagination
- Optimized performance by fetching a limited number of memories at a time

### Memory Details
- Dedicated pages for individual memories with expanded information
- Recommended memories section for related content discovery

### Comments
- Interactive comment system on memory posts
- Engage with other users' experiences and stories

### Client-Side Routing
- Smooth navigation between different sections of the application
- Enhanced user experience with fast page transitions

## Technology Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: JWT and Google OAuth
- **State Management**: [Your chosen state management library, e.g., Redux, Context API]
- **Styling**: [Your chosen CSS framework or methodology, e.g., Styled-components, Tailwind CSS]

## Domain Model

```mermaid
---
title: Reminisce
---
classDiagram
    class User {
      +String id
      +String username
      +String email
      +String password
      +List~Post~ posts
    }
 
    class Post {
      +String id
      +String title
      +String content
      +DateTime createdAt
      +User user
      +List~String~ tags
    }
 
    class Tag {
      +String name
    }
 
    User "1" --* "many" Post : creates
    Post "many" -- "1" User : belongs to
    Post "many" --* "many" Tag : categorized by
``` 

## Getting Started

[Include instructions on how to set up the project locally, including any environment variables, dependencies, and commands to run the application]

## Team Members

| Name | Email |
|------|-------|
| Sarala Sharanappa Kanakagiri | sharanappakanakagi.s@northeastern.edu |
| Suhas Shetty | shetty.suh@northeastern.edu |
| Ullas Puttaiah | puttaiah.u@northeastern.edu |
| Ayush Patil | patil.ay@northeastern.edu |



## Contact

For general inquiries, please contact our team at sharanappakanakagi.s@northeastern.edu

---

Reminisce: Capturing moments, connecting worlds.