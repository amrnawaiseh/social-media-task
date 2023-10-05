document.addEventListener("DOMContentLoaded", async () => {
  if (localStorage.getItem("email")) {
    const postContainer = document.querySelector(".comments-page");
    const commentSubmitBtn = document.querySelector(".comment-submit");
    const addCommentBox = document.querySelector(".add-comment-box");
    const closeTextInput = document.querySelector(".close-text-input");
    const url = "https://jsonplaceholder.typicode.com/posts/";
    const usersUrl = "https://jsonplaceholder.typicode.com/users/";
    const commentsUrl = "https://jsonplaceholder.typicode.com/comments?postId=";

    closeTextInput.addEventListener("click", (e) => {
      addCommentBox.classList.add("hidden");
      document.body.style.overflowY = "auto";
    });

    async function getPost() {
      const queryString = window.location.search;
      const params = new URLSearchParams(queryString);
      const keyValue = params.get("postId");
      const response = await fetch(`${url}${keyValue}`);
      const postData = await response.json();
      return postData;
    }

    async function getUsers(userId) {
      const response = await fetch(`${usersUrl}${userId}`);
      const users = await response.json();
      return users;
    }

    async function checkComments(checkUrl) {
      const response = await fetch(checkUrl);
      const commentsData = await response.json();
      return commentsData;
    }

    async function loadPosts() {
      const targetPost = await getPost();
      const post = document.createElement("div");
      const contactCard = document.createElement("div");
      const contactInfo = document.createElement("div");
      const imageCard = document.createElement("div");
      const postAuthor = document.createElement("p");
      const userName = document.createElement("p");
      const postAuthorImg = document.createElement("img");
      const addCommentElement = document.createElement("p");

      post.textContent = targetPost.body;
      const user = await getUsers(targetPost.userId);

      postAuthorImg.src = "./assets/user.png";
      postAuthor.textContent = user.name;
      userName.textContent = `@${user.username}`;

      const checkUrl = `${commentsUrl}${targetPost.userId}`;
      const comments = await checkComments(checkUrl);

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

      for (let comment of comments) {
        const commentsContainer = document.createElement("div");
        const commentAuthor = document.createElement("p");
        const commentText = document.createElement("p");
        const commentAuthorImg = document.createElement("img");
        const commenterImg = document.createElement("div");
        const commentInfo = document.createElement("div");
        const commentCard = document.createElement("div");

        commentAuthorImg.src = "./assets/user.png";
        commentText.textContent = comment.body;
        commentAuthor.textContent = comment.name;
        addCommentElement.textContent = "Add Comment...";

        commenterImg.appendChild(commentAuthorImg);
        commentInfo.appendChild(commentAuthor);
        commentInfo.appendChild(commentText);
        commentCard.appendChild(commenterImg);
        commentCard.appendChild(commentInfo);
        commentsContainer.appendChild(commentCard);
        commentsContainer.appendChild(addCommentElement);
        postContainer.appendChild(commentsContainer);

        commenterImg.classList.add("comment-img");
        commentInfo.classList.add("comment-info");
        commentCard.classList.add("comment-card");
        commentsContainer.classList.add("comments-container");
        addCommentElement.classList.add("add-comment-btn");

        addCommentElement.addEventListener("click", () =>
          showCommentBox(commentsContainer)
        );
      }

      return postContainer;
    }

    function createComment(href) {
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

    function showCommentBox(comments) {
      const commentsContainer = document.createElement("div");
      commentsContainer.classList.add("comments-container");

      addCommentBox.classList.remove("hidden");
      document.body.style.overflowY = "hidden";
      commentSubmitBtn.onclick = () => {
        const card = createComment();
        document.body.style.overflowY = "auto";
        addCommentBox.classList.add("hidden");
        commentsContainer.appendChild(card);
        postContainer.insertAdjacentElement("beforeend", commentsContainer);
      };
    }

    await loadPosts();
  } else {
    window.location.href = "index.html";
  }
});
