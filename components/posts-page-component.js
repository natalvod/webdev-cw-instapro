import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken } from "../index.js";
import { addLike } from "../api.js";
import { deleteLike } from "../api.js";
import { user } from "../index.js"

export function renderPostsPageComponent({ appEl }) {
  // TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);

  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */

  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">` +

                posts.map((post, id) => {
                  return  `
                  <li class="post" data-index = "${id}">
                    <div class="post-header" data-user-id=${post.user.id}
                    <div class="post-header-user"><img src=${post.user.imageUrl} class="post-header__user-image">
                    <p class="post-header__user-name">${post.user.name}</p>
                    </div>
                    
                    <div class="post-image-container">
                      <img class="post-image" src=${post.imageUrl}>
                    </div>
                    <div class="post-likes">
                    <button data-post-id=${post.id} class="like-button">
                      <img src="./assets/images/${post.isLiked ? 'like-active.svg' : 'like-not-active.svg'}">
                    </button>
                    <p class="post-likes-text">
                       Нравится: <strong>
                        ${post.likes.length > 1 ? post.likes[0].name + ` и ещё ${post.likes.length - 1}`
                        : post.likes.length ? post.likes[0].name
                        : "0"}</strong>
                    </p>
                  </div>
                    </div>
                    <p class="post-text">
                      <span class="user-name">${post.user.name}</span>
                      ${post.description}
                    </p>
                    <p class="post-date">
                      19 минут назад
                    </p>
                    
                  </li>
                `
                }).join('') +
              
                `</ul>
              </div>`;
              
              appEl.innerHTML = appHtml;
              
              renderHeaderComponent({
                element: document.querySelector(".header-container"),
              });
              
              for (let userEl of document.querySelectorAll(".post-header")) {
                userEl.addEventListener("click", () => {
                  goToPage(USER_POSTS_PAGE, {
                    userId: userEl.dataset.userId,
                  });
                });
              }

              const buttonLikeElements = document.querySelectorAll(".like-button");
              for (let buttonLikeElement of buttonLikeElements) {
                buttonLikeElement.addEventListener("click", () => {
                  if (!getToken()) {
                    alert("Лайкать посты могут только авторизованные пользователи!");
                    return;
                  }
                  const postId = buttonLikeElement.dataset.postId;
                  const index = buttonLikeElement.closest(".post").dataset.index;
            
                  if (user && posts[index].isLiked === false) {
                    addLike({
                      token: getToken(),
                      postId: postId,
                    }).catch(() => {
                      posts[index].isLiked = false;
                      posts[index].likes.pop();
                      renderPostsPageComponent({ appEl, posts });
                    });
                    posts[index].isLiked = true;
                    posts[index].likes.push({
                      id: user.id,
                      name: user.name,
                    });
                    renderPostsPageComponent({ appEl, posts });
                  } else if (user && posts[index].isLiked === true) {
                    deleteLike({
                      token: getToken(),
                      postId: postId,
                    }).catch(() => {
                      posts[index].isLiked = true;
                      posts[index].likes.push({
                        id: user.id,
                        name: user.name,
                      });
                    });
                    posts[index].isLiked = false;
                    posts[index].likes.pop();
                    renderPostsPageComponent({ appEl, posts });
                  }
                });
              }
}

