# API Documentation

**@Abdul Waheed** This is a basic structure; you can modify it accordingly. And also match with admin

## Note / Request / Issues
- Please test the endpoint before pushing to GitHub. I have to go back and forth to fix the issues, which slows down the process.
- Use thunder client extenstion (if using vs-code) or postman for testing


## 1. Authentication
**Admin Side Name:  Users Details**

### Login
**Endpoint:** `/auth/login`  
**Method:** POST  
**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```
**Response:**
```json
{
  "id": "string (userID, must)",
  "email": "string",
  "image": "string (optional for signup)",
  "phone": "string"
}
```

### Signup
**Endpoint:** `/auth/signup`  
**Method:** POST  
**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string (optional)",
  "password": "string"
}
```
Note: 
- Please check for duplicate email here
- You can also add a message field to all responses to describe the status, like 'email already exists,' etc.

**Response:**
```json
{
  "uid": "string",
  "email": "string",
  "name": "string",
}
```

### Forgot Password (Optional)
Note: This is optional; you can do it if possible, or it can be handled from the mobile. As we can send email from application itself

**Endpoint:** `/auth/forgotPassword`  
**Method:** POST  
**Request Body:**
```json
{
  "email": "string"
}
```
**Response:**
```json
{
  "code": "string (6-digit)"
}
```

### Reset Password
**Endpoint:** `/auth/resetPassword`  
**Method:** POST  
**Request Body:**
```json
{
  "email": "string",
  "newPassword": "string"
}
```
**Response:**
```json
{
  "uid": "string",
  "email": "string",
  "name":"string",
  "image": "string (optional)"
}
```

---

## 2. Feed 
**Admin Side Name: Feed Posts**

### Fetch Feed
**Endpoint:** `/feed`  
**Method:** GET  
**Response:**

<p style = "color: yellow">Please match exectly with cliet, you miss tags, category, 
also the information about the admin who post that post, 
Now it is just post without author
</p>

```
[
  {
    // Same as on admin side, feed post can be only add from admin side
  },
  ...
]
```
Note: 
- don't return stream for it, we will user pull to refreash for this
- Likes: The likes field should be a list of user IDs (List<String>), where each ID represents a user who liked the post.
- Media Type: Add an isVideo boolean field to the feed post to indicate whether the media attached to the post is a video (true) or an image (false).


### Like/Dislike Post
**Endpoint:** `/feed/likeDislike`  
**Method:** POST  
**Request Body:**
```json
{
  "id": "string (user id)",
  "postId": "string"
}
```
**Response:**
```
{
  "isSuccess": bool,
}
```

### Show Comments (skip it if you add comments directly to post)
**Endpoint:** `/feed/comments`  
**Method:** GET  
**Query Parameters:**
- `postId` (required)

**Response:**
```
[
  {
    // same as of admin side
  },
  ...
]
```

### Add Comment
**Endpoint:** `/feed/addComment`  
**Method:** POST  
**Request Body:**
```json
{
  "id": "string (user id)",
  "postId": "string",
  "text": "string",
  "userName": "string",
  "userImage": "string (optional) not sure right now"
}
```
**Response:**
```json
{
  "message": "string"
}
```

---

## 3. Learn 
**Admin Side Name: Learning Posts**
- Same endpoints and data structure as Feed. Ih has only one change, cannot remember right now

---

## 4. Chat
- I have given you some code for chat, you can take reference from it

- Add image in send message along with text if you use cloudinary for reset of project then it will be a string of Url

## 5. Activity
**Admin Side Name: Activity Management**

The Activity section looks simple to me, similar to posts, but I noticed some differences on the mobile side: links that redirect to other platforms like Facebook, a live tag, start and end times, and location. The rest, such as likes, comments, video etc, will remain the same here.

## 6. Connect
**Admin Side Name: Connect Management**

*Group structure (based on mobile)*
```
groupId (must)
name
membersCount
type (public or private)
category
about
posts (subcollection or list of postIds)
members (subcollection or list of postIds)
```

### Fetch Groups


**Endpoint:** `/connect/groups`  
**Method:** GET  
**Response:**
```
[
  {
    // refer to admin side 
  },
  ...
]
```
Note: Return all groups. I think fetching members and posts together might take time, as it involves multiple queries. Therefore, we can create separate APIs for members and posts. We can fetch them on demand (just my thought)

### Fetch Group Members
**Endpoint:** `/connect/groupMembers`  
**Method:** GET  
**Query Parameters:**
- `groupId` (required)

**Response:**
```
[
  {
    // basic user
  },
]
```

### Fetch Group Posts
**Endpoint:** `/connect/groupPosts`  
**Method:** GET  
**Query Parameters:**
- `groupId` (required)

**Response:**
```
[
  {
    // just like posts like, comments etc, also refer to admin side
  },
  
]
```

### Create new post
<p style = "color: yellow">Here</p>

**Endpoint:** `/connect/groupPosts`  
**Method:** GET  
**Query Parameters:**
- `groupId` (required)
- `uner information who posts`
- `post data like title, media etc`  

**Response:**
```
{
  msg
}
```

---

## 7. Stream
**Admin Side Name: Go Live**
- Stream can be only done by the admin via Admin panal, so there will be only one end point for getting them
- Rest of end points like for showing and intracting with comments and like (same as for feed post)
- Previous Node.js developer created some models. These models might include keys, links (HTTP or WebSocket), or anything which we can use for connecting and playing stream.

---


## 8. Blu Point, Rewards, and Update User Profile
**Admin Side: Inventory Management**
- Endpoint for updating user information, take userId as parameter and update user data
- I'm not sure whether the bluepoints or rewards are for all users of the app or just for a particular user(which admin wants to send). We can discuss this later with the previous Next.js developer.

---


## 9. Helping endpoints

**Endpoint:** `/getUser`  
**Method:** GET  
**Query Parameters:**
- `userId` (required)

**Response:**
```
  {
    // user details
  },

```

## Note
You can use cloudinary for saving image/video