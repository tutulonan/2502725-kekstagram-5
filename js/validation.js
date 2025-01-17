const imgUploadForm = document.querySelector('.img-upload__form');

const MAX_COMMENT_LENGTH = 140;
const MAX_HASHTAG_COUNT = 5;
const VALID_HASHTAG = /^#[a-zа-яё0-9]{1,19}$/i;

const pristine = new Pristine(imgUploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
});

const getHashtagErrorMessage = (value) => {
  const {isValidCount, isValidText, isUnique} = validateHashtagItems(value);
  if (!isValidCount) {
    return 'Нельзя указать больше пяти хэш-тегов';
  }
  if (!isValidText) {
    return 'Строка после решётки должна состоять из букв и чисел и иметь длину не более 20 символов';
  }
  if (!isUnique) {
    return 'Один и тот же хэш-тег не может быть использован дважды';
  }
  return true;
};

function validateComment (value) {
  return value.length <= MAX_COMMENT_LENGTH;
}

const splitHashtags = (hashtags) => hashtags.trim().split(/\s+/);

function validateHashtagItems (value) {
  const isEmpty = value.length === 0;
  const hashtags = splitHashtags(value);
  const isValidCount = hashtags.length <= MAX_HASHTAG_COUNT;
  const isValidText = hashtags.every((hashtag) => VALID_HASHTAG.test(hashtag)) || isEmpty;
  const isUnique = hashtags.length === new Set(hashtags.map((hashtag) => hashtag.toLowerCase())).size;

  return {isValidCount, isValidText, isUnique};
}

function validateHashtag (value) {
  const {isValidCount, isValidText, isUnique} = validateHashtagItems(value);
  return isValidCount && isValidText && isUnique;
}

const initValidation = () => {
  pristine.addValidator(
    imgUploadForm.querySelector('.text__hashtags'),
    validateHashtag,
    getHashtagErrorMessage
  );

  pristine.addValidator(
    imgUploadForm.querySelector('.text__description'),
    validateComment,
    'Длина комментария не может составлять больше 140 символов'
  );

};

const pristineValid = () => pristine.validate();
const resetValidator = () => pristine.reset();
export { initValidation, pristineValid, resetValidator, getHashtagErrorMessage };
