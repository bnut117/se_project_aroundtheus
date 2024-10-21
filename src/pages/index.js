import Section from "../components/Section.js";
import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithImages from "../components/PopupWithImage.js";
import UserInfo from "../components/UserInfo.js";
import "./index.css";
import { initialCards, validationSettings } from "../utils/constants.js";

const userInfo = new UserInfo({
  nameSelector: "#profile-name",
  jobSelector: "#profile-description",
});

function renderer(cardData) {
  const cardElement = createCard(cardData);
  section.addItem(cardElement);
}

const section = new Section(
  {
    items: initialCards,
    renderer: renderer,
  },
  ".cards__list"
);

section.renderItems();

const profileEditModal = new PopupWithForm(
  "#profile-edit-modal",
  handleProfileEditSubmit
);
profileEditModal.setEventListeners();

const addCardModal = new PopupWithForm(
  "#add-card-modal",
  handleAddCardEditSubmit
);
addCardModal.setEventListeners();

const previewImageModal = new PopupWithImages("#image-preview-modal");
previewImageModal.setEventListeners();

/*************
 * ELEMENTS; *
 *************/

const profileEditButton = document.querySelector("#profile-edit-button");

const profileEditModalElement = document.querySelector("#profile-edit-modal");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

const profileTitleInput = document.querySelector("#profile-title-input");
const profileDescriptionInput = document.querySelector(
  "#profile-description-input"
);

const profileEditForm = profileEditModalElement.querySelector(".modal__form");

const addNewCardButton = document.querySelector(".profile__add-button");

const addCardModalEl = document.querySelector("#add-card-modal");
const addCardForm = addCardModalEl.querySelector(".modal__form");
const addCardModalCloseButton = addCardModalEl.querySelector(
  "#profile-edit-close-button"
);

/*************
 * FUNCTIONS *
 *************/

function openImageModal(imageSrc, imageAlt) {
  previewImageModal.open({ name: imageAlt, link: imageSrc });
}

function createCard(data) {
  const card = new Card(data, "#card-template", openImageModal);
  return card.getView();
}

/******************
 * EVENT HANDLERS *
 ******************/

function handleProfileEditSubmit(data) {
  console.log(data);
  userInfo.setUserInfo({ name: data.name, job: data.description });
  profileTitle.textContent = profileTitleInput.value;
  profileDescription.textContent = profileDescriptionInput.value;
  profileEditModal.close();
  //closeModal(profileEditModal);
}

function handleAddCardEditSubmit(data) {
  console.log(data);
  renderer(data);
  addCardForm.reset();
  addCardFormValidator.disableButton();
  addCardModal.close();
}

/*******************
 * EVENT LISTENERS *
 *******************/

profileEditButton.addEventListener("click", () => {
  const userData = userInfo.getUserInfo();
  profileTitleInput.value = userData.name.trim();
  profileDescriptionInput.value = userData.job.trim();
  profileEditModal.open();
});

profileEditForm.addEventListener("submit", handleProfileEditSubmit);

//add new card button
addNewCardButton.addEventListener("click", () => addCardModal.open());

addCardModalCloseButton.addEventListener("click", () => addCardModal.close());

const addCardFormValidator = new FormValidator(validationSettings, addCardForm);
addCardFormValidator.enableValidation();
addCardFormValidator.disableButton();

const editProfileFormValidator = new FormValidator(
  validationSettings,
  profileEditForm
);
editProfileFormValidator.enableValidation();
editProfileFormValidator.disableButton();
