

document.addEventListener("DOMContentLoaded", async () => {
  if (localStorage.getItem("email")) {
    const postsContainer = document.querySelector(".home-page");
    const commentSubmitBtn = document.querySelector(".comment-submit");
    const addCommentBox = document.querySelector(".add-comment-box");
    const addPostElement = document.querySelector(".post-btn");
    const closeTextInput = document.querySelector(".close-text-input");
    const url = "https://jsonplaceholder.typicode.com/posts/";
    const usersUrl = "https://jsonplaceholder.typicode.com/users/";
    const allCommentsUrl = "https://jsonplaceholder.typicode.com/comments";
    const commentsMap = {};
    const usersMap = {};

    closeTextInput.addEventListener("click", (e) => {
      addCommentBox.classList.add("hidden");
      document.body.style.overflowY = "auto";
    });

    const getAllposts = async () => {
      const response = await fetch(`${url}`);
      const data = await response.json();
      return data;
    };

    const getAllComments = async () => {
      const response = await fetch(allCommentsUrl);
      const comments = await response.json();
      comments.map((comment) => {
        if (commentsMap[comment.postId]) {
          commentsMap[comment.postId].push(comment);
        } else {
          commentsMap[comment.postId] = [comment];
        }
      });
    };

    const getAllUsers = async () => {
      const response = await fetch(usersUrl);
      const users = await response.json();
      users.map((user) => {
        if (!usersMap[user.id]) {
          usersMap[user.id] = user;
        }
      });
    };

    async function loadPosts() {
      const allPosts = await getAllposts();

      const postsArray = Promise.all(
        allPosts.map(async (ele) => {
          const postContainer = document.createElement("div");
          const post = document.createElement("div");
          const contactCard = document.createElement("div");
          const contactInfo = document.createElement("div");
          const imageCard = document.createElement("div");
          const postAuthor = document.createElement("p");
          const userName = document.createElement("p");
          const postAuthorImg = document.createElement("img");
          const addCommentElement = document.createElement("p");
          const seeComments = document.createElement("a");
          const commentsContainer = document.createElement("div");
          const commentAuthor = document.createElement("p");
          const commentText = document.createElement("p");
          const commentAuthorImg = document.createElement("img");
          const commenterImg = document.createElement("div");
          const commentInfo = document.createElement("div");
          const commentCard = document.createElement("div");
          const commentsSection = document.createElement("div");

          post.textContent = ele.body;
          const usersObj = usersMap[ele.userId];

          postAuthorImg.src = "./assets/user.png";
          postAuthor.textContent = usersObj.name;
          userName.textContent = `@${usersObj.username}`;

          imageCard.appendChild(postAuthorImg);
          contactInfo.appendChild(postAuthor);
          contactInfo.appendChild(userName);
          contactCard.appendChild(imageCard);
          contactCard.appendChild(contactInfo);
          postContainer.appendChild(contactCard);
          postContainer.appendChild(post);

          imageCard.classList.add("image-card");
          contactInfo.classList.add("contact-info");
          contactCard.classList.add("contact-card");
          postContainer.classList.add("post-container");
          post.classList.add("post-body");

          const comments = commentsMap[ele.id];
          const commentBody = comments[0].body;
          const commenterId = comments[0].name;

          commentAuthorImg.src = "./assets/user.png";
          commentText.textContent = commentBody;
          commentAuthor.textContent = commenterId;
          seeComments.textContent = "See Comments";
          addCommentElement.textContent = "Add Comment...";

          commenterImg.appendChild(commentAuthorImg);
          commentInfo.appendChild(commentAuthor);
          commentInfo.appendChild(commentText);
          commentCard.appendChild(commenterImg);
          commentCard.appendChild(commentInfo);
          commentsSection.appendChild(commentCard);
          commentsSection.appendChild(seeComments);
          commentsContainer.appendChild(commentsSection);
          commentsContainer.appendChild(addCommentElement);
          postContainer.appendChild(commentsContainer);

          commenterImg.classList.add("comment-img");
          commentInfo.classList.add("comment-info");
          commentCard.classList.add("comment-card");
          commentsSection.classList.add("comments-section");
          commentsContainer.classList.add("comments-container");
          addCommentElement.classList.add("add-comment-btn");
          seeComments.href = `comments.html?postId=${ele.id}`;
          seeComments.target = "_blank";

          addCommentElement.addEventListener("click", () =>
            showCommentBox(commentsContainer, seeComments.href)
          );
          addPostElement.addEventListener("click", () =>
            showPostBox(postsContainer)
          );

          return postContainer;
        })
      );

      return postsArray;
    }

    const displayPosts = async () => {
      const elements = await loadPosts();
      elements.forEach((element) => {
        postsContainer.append(element);
      });
    };

    function createComment() {
      const commentCard = document.createElement("div");
      const commentInput = document.querySelector(".comment-input");
      const value = commentInput.value;

      commentCard.innerHTML = `
                <div class="comments-section">
                    <div class="comment-card">
                        <div class="comment-img"><img src="./assets/user.png"></div>
                        <div class="comment-info">
                            <p>${localStorage.getItem("name")}</p>
                            <p>${value}</p>
                        </div>
                    </div>
                </div>
            `;

      commentInput.value = "";
      return commentCard;
    }

    function showCommentBox(comments, href) {
      addCommentBox.classList.remove("hidden");
      document.body.style.overflowY = "hidden";
      commentSubmitBtn.onclick = () => {
        const card = createComment(href);
        document.body.style.overflowY = "auto";
        addCommentBox.classList.add("hidden");

        comments.prepend(card);
      };
    }

    async function postFetch(value) {
      const userId = localStorage.getItem("id");

      await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        body: JSON.stringify({
          body: value,
          userId: userId,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((json) => console.log(json));
    }

    async function createPost() {
      const postCard = document.createElement("div");
      const postInput = document.querySelector(".comment-input");
      const value = postInput.value;

      postCard.innerHTML = `
            <div class="post-container">
                <div class="contact-card">
                    <div class="image-card">
                        <img src="./assets/user.png">
                    </div>
                    <div class="contact-info">
                        <p>${localStorage.getItem("name")}</p>
                        <p>${localStorage.getItem("email")}</p>
                    </div></div>
                <div class="post-body">${value}</div>
                <div class="comments-container">
                   <p class="add-comment-btn">Add Comment...</p>
                </div>
            </div>
            `;

      await postFetch(value);

      postInput.value = "";

      return postCard;
    }

    function showPostBox() {
      const header = document.querySelector(".header");
      addCommentBox.classList.remove("hidden");
      document.body.style.overflowY = "hidden";
      commentSubmitBtn.onclick = async () => {
        const card = await createPost();
        document.body.style.overflowY = "auto";
        addCommentBox.classList.add("hidden");

        header.after(card);
      };
    }

    await getAllUsers();
    await getAllComments();
    await displayPosts();
  } else {
    window.location.href = "index.html";
  }
});
