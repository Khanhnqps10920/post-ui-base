import utils from "./utils.js";
import postApi from "./API/postApi.js";

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

  // formValue.imageUrl = utils.getBackgroundImageByElementId('postHeroImage');
  return formValue;
}



const handleFormSubmit = async () => {

  //get form value
  const formValue = getFormValue();
  try {
    //create newpost
    const newPost = {
      ...formValue,
    }

    const postAdded = await postApi.add(newPost);

    const postDetailUrl = `post-detail.html?postId=${postAdded.id}`;

    window.location = postDetailUrl;
  } catch (error) {
    alert('lỗi nè', error);
  }

}









const init = async () => {

  //get and add event for form  
  const postForm = getPostForm();

  const postId = window.location.search.substring(8);

  if (postForm) {
    postForm.addEventListener('submit', (e) => {

      handleFormSubmit(e);

      e.preventDefault();


    })
  }



}

init();