```mermaid
---
title: Reminisce - Enhanced Domain Model with Likes
---
classDiagram
    class User {
      +String id
      +String username
      +String email
      +String password
      +String profilePicture
      +String bio
      +List~Post~ posts
      +List~Like~ likes
    }

    class Post {
      +String id
      +String title
      +String content
      +DateTime createdAt
      +User author
      +List~Tag~ tags
      +List~Comment~ comments
      +int likeCount
    }

    class Tag {
      +String id
      +String name
    }

    class Comment {
      +String id
      +String text
      +DateTime createdAt
      +User author
    }

    class Like {
      +String id
      +User user
      +Post post
      +DateTime likedAt
    }

    User "1" --* "many" Post : "creates"
    Post "1" -- "1" User : "belongs to"
    Post "*" -- "*" Tag : "categorized by"
    Post "*" -- "*" Comment : "includes"
    Comment "1" -- "1" User : "authored by"
    User "1" -- "*" Like : "likes"
    Post "1" -- "*" Like : "liked by"
