export default class Card {
  constructor(
    { _id, name, link, isLiked },
    cardSelector,
    handleImageClick,
    handleDeleteCard,
    handleLike
  ) {
    this._id = _id;
    this._name = name;
    this._link = link;
    this._isLiked = isLiked;
    this._cardSelector = cardSelector;
    this._handleImageClick = handleImageClick;
    this._handleDeleteCardWithApi = handleDeleteCard;
    this._handleLike = handleLike;
  }

  _setEvenetListeners() {
    //".card__like-button"
    this._cardElement
      .querySelector(".card__like-button")
      .addEventListener("click", () => {
        this._handleLike(this);
      });
    //".card__delete-button"
    this._cardElement
      .querySelector(".card__delete-button")
      .addEventListener("click", () => {
        this._handleDeleteCardWithApi(this);
      });
    //"_cardImageEl"
    this._cardImageEl.addEventListener("click", () => {
      this._handleImageClick(this._link, this._name);
    });
  }

  _handleDeleteCard() {
    this._cardElement.remove();
  }

  setLikeState(isLiked) {
    const likeButton = this._cardElement.querySelector(".card__like-button");
    if (isLiked) {
      likeButton.classList.add("card__like-button_active");
    } else {
      likeButton.classList.remove("card__like-button_active");
    }
  }

  isLiked() {
    return this._isLiked;
  }

  updateIsLiked(isLiked) {
    this._isLiked = isLiked;
  }

  getView() {
    this._cardElement = document
      .querySelector(this._cardSelector)
      .content.querySelector(".card")
      .cloneNode(true);
    this._cardImageEl = this._cardElement.querySelector(".card__image");
    this._cardTitleEl = this._cardElement.querySelector(".card__title"); // get the title element
    this._cardTitleEl.textContent = this._name;
    this._cardImageEl.src = this._link;
    this._cardImageEl.alt = this._name;

    this.setLikeState(this._isLiked);
    this._setEvenetListeners();

    return this._cardElement;
  }
}
