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
// const addCardForm = addCardModal.querySelector(".modal__form");

// const cardTitleInput = addCardForm.querySelector(".modal__input_type_title");
// const cardLinkInput = addCardForm.querySelector(".modal__input_type_link");

const cardListEl = document.querySelector(".cards__list");
const cardTemplate =
  document.querySelector("#card-template").content.firstElementChild;
const addNewCardButton = document.querySelector(".profile__add-button");

//add Image Modal function
const imagePreviewModal = document.querySelector("#image-preview-modal");
const imagePreviewCloseButton = imagePreviewModal.querySelector(
  "#image-preview-close-button"
);
const modalImage = imagePreviewModal.querySelector("#modal-image");
// Add event listener to close button of the image preview modal

/*imagePreviewCloseButton.addEventListener("click", () =>
  closeModal(imagePreviewModal)
); */

const modalCaption = document.querySelector("#modal-caption");

const addCardModalEl = document.querySelector("#add-card-modal");
const addCardForm = addCardModalEl.querySelector(".modal__form");
const cardTitleInput = addCardModalEl.querySelector(".modal__input_type_title");
const cardLinkInput = addCardModalEl.querySelector(".modal__input_type_link");
const addCardModalCloseButton = addCardModalEl.querySelector(
  "#profile-edit-close-button"
);

/*************
 * FUNCTIONS *
 *************/

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  modal.removeEventListener("click", handleOverlayClick);
  document.removeEventListener("keydown", handleEscPress);
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  modal.addEventListener("click", handleOverlayClick);
  document.addEventListener("keydown", handleEscPress);
}

function renderCard(data) {
  const cardElement = createCard(data);
  cardListEl.prepend(cardElement);
}

function openImageModal(imageSrc, imageAlt, captionText) {
  modalImage.src = imageSrc;
  modalImage.alt = imageAlt;
  modalCaption.textContent = captionText || imageAlt;
  //openModal(imagePreviewModal);
}

function createCard(data) {
  const card = new Card(data, "#card-template", openImageModal);
  return card.getView();
}

/*function handleOverlayClick(e) {
  if (e.target.classList.contains("modal")) {
    closeModal(e.target);
  }
}

function handleEscPress(e) {
  if (e.key === "Escape") {
    const modalElement = document.querySelector(".modal_opened");
    if (modalElement) {
      closeModal(modalElement.closest(".modal"));
    }
  }
} */

/******************
 * EVENT HANDLERS *
 ******************/

function handleProfileEditSubmit(e) {
  e.preventDefault();
  userInfo.setUserInfo({ name: data.name, job: data.description });
  profileTitle.textContent = profileTitleInput.value;
  profileDescription.textContent = profileDescriptionInput.value;
  profileEditModal.close();
  //closeModal(profileEditModal);
}

function handleAddCardEditSubmit(e) {
  e.preventDefault();
  const name = cardTitleInput.value;
  const link = cardLinkInput.value;
  renderCard({ name, link }, cardListEl);
  addCardForm.reset();
  addCardFormValidator.disableButton();
  addCardModal.close();
  //closeModal(addCardModal);
}

/*******************
 * EVENT LISTENERS *
 *******************/

profileEditButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  profileEditModal.open();
  //openModal(profileEditModal);
});

profileEditForm.addEventListener("submit", handleProfileEditSubmit);
addCardForm.addEventListener("submit", handleAddCardEditSubmit);

//initialCards.forEach((data) => renderCard(data, cardListEl));

//add new card button
addNewCardButton.addEventListener("click", () => addCardModal.open());

addCardModalCloseButton.addEventListener("click", () => addCardModal.close());
//  closeModal(addCardModal)
// );

const addCardFormValidator = new FormValidator(validationSettings, addCardForm);
addCardFormValidator.enableValidation();
addCardFormValidator.disableButton();

const editProfileFormValidator = new FormValidator(
  validationSettings,
  profileEditForm
);
editProfileFormValidator.enableValidation();
editProfileFormValidator.disableButton();
