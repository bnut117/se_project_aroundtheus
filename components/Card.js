export default class Card {
  constructor({ name, link }, cardSelector, handleImageClick) {
    this._name = name;
    this._link = link;
    this._cardSelector = cardSelector;
    this._handleImageClick = handleImageClick;
  }

  _setEvenetListeners() {
    //".card__like-button"
    this._cardElement
      .querySelector(".card__like-button")
      .addEventListener("click", () => {
        this.handleLikeIcon();
      });
    //".card__delete-button"
    this._cardElement
      .querySelector(".card__delete-button")
      .addEventListener("click", () => {
        this.handleDeleteCard();
      });
    //"_cardImageEl"
    this._cardImageEl.addEventListener("click", () => {
      this._handleImageClick(this._name, this._link);
    });
  }

  _handleDeleteCard() {
    this._cardElement.remove();
  }

  _handleLikeIcon() {
    this._cardElement
      .querySelector(".card__like-button")
      .classList.toggle("card__like-button_active");
  }

  getView() {
    this._cardElement = document
      .querySelector(this._cardSelector)
      .content.querySelector(".card")
      .cloneNode(true);
    this._cardImageEl = this._cardElement.querySelector(".card__image");
    this._cardImageEl.src = this._link;
    this._cardImageEl.alt = this._name;

    this._setEvenetListeners();
  }
}
