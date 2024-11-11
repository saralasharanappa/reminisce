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
