import utils from "./utils.js";
import postApi from "./API/postApi.js";
import AppConstants from "./appConstants.js";

const getPostForm = () => document.querySelector('#postForm');

const getFormValue = () => {
  const formValue = {};
  //set control name
  const controlNameList = ['title', 'author', 'description'];
  const formPost = getPostForm();
  if (formPost) {
    for (const controlName of controlNameList) {
      //get input name = control name
      const formInput = formPost.querySelector(`[name=${controlName}]`);
      formValue[controlName] = formInput.value;
    }
  }

  formValue.imageUrl = utils.getBackgroundImageByElementId('postHeroImage');
  return formValue;
}

const setFormValue = (post) => {

  //get value form post
  const formValue = {
    title: post.title,
    author: post.author,
    description: post.description
  }
  //set post detail value by control name
  const formPost = getPostForm();

  const controlNameList = ['title', 'author', 'description'];
  for (const controlName of controlNameList) {
    const formInput = formPost.querySelector(`[name=${controlName}]`);
    formInput.value = formValue[controlName];
  }
  // set value by name 

  //lười custom <3
  utils.setBackgroundImageByElementId('postHeroImage', post.imageUrl);

}

const handleRandomImg = () => {
  //create random number
  const randomNumber = Math.trunc(Math.random() * 500);

  const imageUrl = `https://picsum.photos/id/${randomNumber}/${AppConstants.DEFAULT_IMAGE_WIDTH}/${AppConstants.DEFAULT_IMAGE_HEIGHT}`;

  const backgroundHero = document.querySelector('#postHeroImage');
  if (backgroundHero) {
    backgroundHero.style.backgroundImage = `url(${imageUrl})`;
  }
  console.log(imageUrl);
}

const validateForm = () => {

  //create flag 
  let isValidate = true;

  //get author and title 
  const postAuthor = document.querySelector('#postAuthor');
  const postTitle = document.querySelector('#postTitle');
  if (postAuthor && postTitle) {
    //check value if null
    if (!postAuthor.value) {
      postAuthor.classList.add('is-invalid');
      isValidate = false;
    }

    if (!postTitle.value) {
      postTitle.classList.add('is-invalid');
      isValidate = false;
    }
  }

  return isValidate;
}

const handleUpdateSubmit = async (postId) => {
  const formValue = getFormValue();
  const isValid = validateForm();
  let hasChanges = false;
  if (isValid) {
    try {
      const newPost = {
        ...formValue,
        id: postId
      };

      if (postId) {

        const post = await postApi.getDetail(postId);

        for (const key in newPost) {
          if (newPost[key] !== post[key]) {
            hasChanges = true;
          }
        }

        if (!hasChanges) {
          alert('Hk có gì thay đổi cả');
          // console.log(flag);
        } else {
          await postApi.update(newPost);
          alert('Edit thành công nè');
        }
      }

    } catch (error) {
      console.log('lỗi nè', error);
    }
  }


}

const handleFormSubmit = async () => {

  //get form value 
  const formValue = getFormValue();
  const validate = validateForm();

  if (validate) {
    try {
      //create newpost
      const newPost = {
        ...formValue,
      }

      const postAdded = await postApi.add(newPost);

      const postDetailUrl = `post-detail.html?postId=${postAdded.id}`;

      window.location = postDetailUrl;

      alert('Thêm thành công nè, xem thông tin của trang');


    } catch (error) {
      alert('lỗi nè', error);
    }
  }
}


const init = async () => {

  //get and add event for form  
  const params = new URLSearchParams(window.location.search);
  const postId = params.get('postId');
  //mode edit
  if (postId) {

    //fetch post by postId
    const post = await postApi.getDetail(postId);
    // then set form value
    setFormValue(post);

    //add link to post-detail
    const linkToPostDetail = document.querySelector('#goToDetailPageLink');
    if (linkToPostDetail) {
      linkToPostDetail.href = `post-detail.html?postId=${postId}`;
      linkToPostDetail.innerHTML = '<i class="fas fa-eye mr-1"></i> Xem thông tin post nè ';
    }

  } else {
    handleRandomImg();
  }
  // get form post


  const postChangeBtn = document.querySelector('#postChangeImage');
  if (postChangeBtn) {
    postChangeBtn.addEventListener('click', handleRandomImg);
  }

  const postForm = getPostForm();
  if (postForm) {
    postForm.addEventListener('submit', (e) => {

      if (postId) {
        handleUpdateSubmit(postId);
      } else {
        handleFormSubmit();
      }


      e.preventDefault();
    })
  };
}

init();

