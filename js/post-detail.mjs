import postApi from "./API/postApi.js";
import utils from "./utils.js";


const renderPost = (post) => {
  //set banner images
  // const postImage = document.querySelector('#postHeroImage');
  // if (postImage) {
  //   postImage.style.background = `url("${post.imageUrl}")`;
  // }
  utils.setBackgroundImageByElementId('postHeroImage', post.imageUrl);
  //set title
  utils.setTextByElementId('postDetailTitle', post.title);
  //set author
  utils.setTextByElementId('postDetailAuthor', post.author);
  //set date time
  const dateString = `- ${utils.formatDate(post.updatedAt)}`;
  console.log(dateString);
  utils.setTextByElementId('postDetailTimeSpan', dateString);
  //set description
  utils.setTextByElementId('postDetailDescription', post.description)
}

const updateEditLink = (post) => {
  const editLink = document.querySelector('#goToEditPageLink');
  if (editLink) {
    editLink.href = `add-edit-post.html?postId=${post.id}`;
    editLink.innerHTML = '<i class="fas fa-edit"></i> Edit link';
  }
}

const init = async () => {
  try {
    // get postId form query params
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('postId');
    if (!postId) return;
    //fetch post detail by id
    const post = await postApi.getDetail(postId);
    //render post
    renderPost(post);
    //update
    updateEditLink(post);

  } catch (error) {
    console.log('Lỗi nè', error);
  }
}

init();