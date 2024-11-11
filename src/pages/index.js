import Section from "../components/Section.js";
import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithImages from "../components/PopupWithImage.js";
import PopupWithConfirm from "../components/PopupWithConfirm.js";
import UserInfo from "../components/UserInfo.js";
import Api from "../components/Api.js";
import "./index.css";
import { initialCards, validationSettings } from "../utils/constants.js";

const userInfo = new UserInfo({
  nameSelector: "#profile-name",
  jobSelector: "#profile-description",
  avatarSelector: ".profile__image",
});

function renderer(cardData) {
  const cardElement = createCard(cardData);
  section.addItem(cardElement);
}

const section = new Section(
  {
    renderer: renderer,
  },
  ".cards__list"
);

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

// const cardDeleteButton = document.querySelector(".card__delete-button");

const addCardModalEl = document.querySelector("#add-card-modal");
const addCardForm = addCardModalEl.querySelector(".modal__form");

const deleteCardModal = new PopupWithConfirm("#confirm-delete-modal");
deleteCardModal.setEventListeners();

/*************
 * FUNCTIONS *
 *************/

function openImageModal(imageSrc, imageAlt) {
  previewImageModal.open({ name: imageAlt, link: imageSrc });
}

/* function createCard(data) {
  const card = new Card(data, "#card-template", openImageModal);
  const cardElement = card.getView();

  const deleteButton = cardElement.querySelector(".card__delete-button");
  deleteButton.addEventListener("click", () => {
    deleteCardModal.setSubmitAction(() => {
      api
        .deleteCard(data._id)
        .then(() => {
          cardElement.remove();
          deleteCardModal.close();
        })
        .catch((err) => console.error(`Error: ${err}`));
    });
    deleteCardModal.open({ cardElement });
  });

  return cardElement;
} */

function createCard(data) {
  const card = new Card(
    data,
    "#card-template",
    openImageModal,
    handleDeleteCardWithApi,
    handleLike
  );
  const cardElement = card.getView();

  return cardElement;
}

function handleDeleteCardWithApi(data) {
  deleteCardModal.open();

  deleteCardModal.setSubmitAction(() => {
    api
      .deleteCard(data._id)
      .then(() => {
        data._handleDeleteCard();
        deleteCardModal.close();
      })
      .catch((err) => console.error(`Error: ${err}`));
  });
}

/******************
 * EVENT HANDLERS *
 ******************/

function handleProfileEditSubmit(data) {
  api
    .updateUserProfile({ name: data.title, about: data.description })
    .then((user) => {
      userInfo.setUserInfo({ name: user.name, job: user.about });
    });
  profileEditModal.close();
}

function handleAddCardEditSubmit(data) {
  api
    .addCard(data)
    .then((newCard) => {
      renderer(newCard);
      addCardForm.reset();
      addCardFormValidator.disableButton();
      addCardModal.close();
    })
    .catch((err) => console.error(`Error creating card: ${err}`))
    .finally(() => {
      addCardModal.setIsLoading(false); // Reset button text to default
    });
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

//add new card button
addNewCardButton.addEventListener("click", () => addCardModal.open());

// cardDeleteButton.addEventListener("click", () => )

const addCardFormValidator = new FormValidator(validationSettings, addCardForm);
addCardFormValidator.enableValidation();
addCardFormValidator.disableButton();

const editProfileFormValidator = new FormValidator(
  validationSettings,
  profileEditForm
);
editProfileFormValidator.enableValidation();
editProfileFormValidator.disableButton();

/*******************
 * New code before sorting*
 ******************/

function handleDeleteCard(cardData) {
  cardData.cardElement.remove();
  deleteCardModal.close();
}

const avatarEditModal = new PopupWithForm(
  "#avatar-edit-modal",
  handleAvatarEditSubmit
);
avatarEditModal.setEventListeners();

function handleAvatarEditSubmit(data) {
  //const avatarImage = document.querySelector("#profile__image");
  api
    .updateUserAvatar(data.avatar)
    .then(() => {
      userInfo.setUserInfo({ avatar: data.avatar });
      avatarEditModal.close();
    })
    .catch((err) => console.error(`Error updating avatar: ${err}`));
}

const avatarEditButton = document.querySelector("#avatar-edit-button");
avatarEditButton.addEventListener("click", () => avatarEditModal.open());

//api
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "0ce0ab02-3e1b-4a63-8c2f-955fb2191e31",
  },
});

api
  .getUserData()
  .then((data) => {
    userInfo.setUserInfo({
      name: data.name,
      job: data.about,
      avatar: data.avatar,
    });
  })
  .catch((err) => console.error(err));

api
  .getInitialCards()
  .then((data) => {
    section.renderItems(data);
  })
  .catch((err) => console.error(err));

function handleLike(cardData) {
  const isLiked = cardData.isLiked();

  if (isLiked) {
    api
      .unlikeCard(cardData._id)
      .then(() => {
        cardData.updateIsLiked(false);
        cardData.setLikeState(false);
      })
      .catch((err) => console.error(`Error: ${err}`));
  } else {
    api
      .likeCard(cardData._id)
      .then(() => {
        cardData.updateIsLiked(true);
        cardData.setLikeState(true);
      })
      .catch((err) => console.error(`Error: ${err}`));
  }
}
