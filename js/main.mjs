'use strict';

import AppConstants from "./appConstants.js";
import postApi from "./API/postApi.js";



// const getPostList = () => {
//   const options = {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//   };

//   return fetch('https://js-post-api.herokuapp.com/api/posts', options)
//     .then(response => {
//       console.log(response);

//       if (response.status >= 200 && response.status < 300) {
//         // response.json().then(data => console.log(data));
//         return response.json();
//       }

//     });
// };



// getPostList().then(data => console.log(data));


//await chir dung trong ham async
// const getPostListAsync = async () => {
//   const options = {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//   };

//   const response = await fetch('https://js-post-api.herokuapp.com/api/posts', options);

//   if (response.status >= 200 && response.status < 300) {
//     // response.json().then(data => console.log(data));
//     return response.json();
//   };


// };

// const getPostDetail = async (postId) => {
//   const options = {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   }

//   const url = `${AppConstants.API_URL}/posts/${postId}`;

//   const response = await fetch(url, options);
//   if (response.status >= 200 && response.status < 300) {
//     return response.json();
//   }

// };

// const updatePost = async (post) => {
//   const options = {
//     method: 'PATCH',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(post),
//   }

//   const url = `${AppConstants.API_URL}/posts/${post.id}`;

//   const response = await fetch(url, options);
//   if (response.status >= 200 && response.status < 300) {
//     return response.json();
//   }

// };
// // fetch return promise




const getPostList = () => document.querySelector('#postsList');

const checkTextLength = (text, length) => {
  if (!text || length < 0) return '';

  const textLength = text.length > length ? `${text.substring(0, length - 5)}...` : text;

  return textLength;
}

const randomNumber = (number) => {
  const random = Math.trunc(Math.random() * number);

  return random;
}

const buildPostItem = (obj) => {

  //get and clone template
  const postItemTemplate = document.querySelector('#postItemTemplate');
  const postItemFragment = postItemTemplate.content.cloneNode(true);
  const postItemElement = postItemFragment.querySelector('li');

  //get and set title 

  const postItemTitle = postItemElement.querySelector('#postItemTitle');
  if (postItemTitle) {
    postItemTitle.textContent = obj.title;
  }

  //get and set description
  const description = postItemElement.querySelector('#postItemDescription');
  if (description) {
    description.textContent = checkTextLength(obj.description, 100);
  }

  //get and set images
  const imageItemElement = postItemElement.querySelector('#postItemImage');
  if (imageItemElement) {
    const srcImgTest = obj.imageUrl.split('/');
    srcImgTest.pop();
    srcImgTest.pop();
    srcImgTest.push('400', '117?grayscale');
    // srcImgTest.join('/') hk đc 
    imageItemElement.src = srcImgTest.join('/');
  }

  return postItemElement;
}

// -----------------------
// MAIN LOGIC
// -----------------------
const init = async () => {
  // Write your logic here ....
  // const data = await getPostListAsync();
  // const post = await getPostDetail('1356b24a-8b63-41dc-9bbe-1bfd5f4a219a');
  // console.log(data, post);

  // post.author = 'KhanhNguyen';
  // const updatedPost = await updatePost(post);
  // console.log(updatedPost);

  // const postList = await postApi.getAll();

  // console.log(postList);

  // const post = await postApi.getDetail('1356b24a-8b63-41dc-9bbe-1bfd5f4a219a');
  // console.log(post);


  // const person1 = {
  //   title: 'hellonenenenene',
  //   author: 'khanh',
  //   imageUrl: '#',
  // }

  // await postApi.add(person1);

  // const postListAgain = await postApi.getAll();

  // console.log(postListAgain);

  // let search = location.search;

  // console.log(search);

  //post detail -> lấy postId -> fetch postdetail -> render post -> update edit link

  // fetch data -> loop data -> render -> event -> click -> e.stopPropagation() on edit -> update addlink 
  try {
    const datas = await postApi.getAll();

    const postsList = getPostList();

    if (datas && postsList) {
      if (Array.isArray(datas)) {
        for (const data of datas) {
          const postItemElement = buildPostItem(data);
          postsList.appendChild(postItemElement);
        }
      }
    };
  } catch (error) {
    console.log('Cant fetch list', error);
  }

  postApi.getAll().then(postLists => console.log(postLists));
}

init();
