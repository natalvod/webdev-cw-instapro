import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";
import { addPostUser } from "../api.js"
import { POSTS_PAGE } from "../routes.js";
import { getToken, goToPage } from "../index.js";

let imageUrl = "";

export function renderAddPostPageComponent({ appEl }) {
  const render = () => {
    // TODO: Реализовать страницу добавления поста
    const appHtml = `<div class="page-container">
    <div class="header-container"></div>
    <div class="form">
      <h3 class="form-title">Добавить пост</h3>
      <div class="form-inputs">
        <div class="upload-image-container">
<div class="upload=image">
    
          <label class="file-upload-label secondary-button">
              <input type="file" class="file-upload-input" style="display:none">
              Выберите фото
          </label>
</div>
</div>
        <label>
          Опишите фотографию:
          <textarea class="input textarea" rows="4"></textarea>
          </label>
          <button  class="button" id="add-button">Добавить</button>
      </div>
    </div>
  </div>
  `;
    
    appEl.innerHTML = appHtml;

    //рендер шапки после добавления поста
    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });
    //рендер формы добавления изображения
    renderUploadImageComponent({
      element: document.querySelector(".upload-image-container"),
      onImageUrlChange: (newImageUrl) => { imageUrl = newImageUrl; }
    });

  document.getElementById("add-button").addEventListener("click", async () => {
    const textInputElement =
      document.querySelector(".textarea");

    if (!imageUrl) {
      alert("Добавьте фото");
      return;
    }

    if (!textInputElement.value) {
      alert("Добавьте описание фотографии");
      return;
    }

    addPostUser({
      token: getToken(),
      description: textInputElement.value,
      imageUrl,
    })
      .then((response) => {
        return response.json();
      })
      .then(() => {
        goToPage(POSTS_PAGE);
      });
  });
};

  render();
}
