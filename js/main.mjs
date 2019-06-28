'use strict';

import anime from "../anime-master/lib/anime.es.js"
import AppConstants from "./appConstants.js";
import postApi from "./API/postApi.js";
import utils from "./utils.js";



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



const getPostList = () => document.querySelector('#postsList');

const checkTextLength = (text, length) => {
  if (!text || length < 0) return '';

  const textLength = text.length > length ? `${text.substring(0, length - 5)}...` : text;

  return textLength;
}

const handleRemoveBtnClick = async (e, postItem) => {

  try {
    const postListElement = getPostList();

    if (postItem && postListElement) {

      const confirmMess = 'B muốn xóa post này hẻ ? thiệt hk';

      if (window.confirm(confirmMess)) {

        //gọi id nè
        await postApi.remove(postItem.id);

        window.location.reload();
      }

    }
  } catch (error) {
    Alert('lỗi nè', error);
  }

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

  //set post author
  const postAuthorElement = postItemElement.querySelector('#postItemAuthor');
  if (postAuthorElement) {
    postAuthorElement.innerText = obj.author;
  }

  //set time 
  const postTimeElement = postItemElement.querySelector('#postItemTimeSpan');
  if (postTimeElement) {
    postTimeElement.innerText = `- ${utils.formatDate(obj.updatedAt)}`;
  }

  //set event click post
  const postItem = postItemElement.querySelector('#postItem');
  if (postItem) {
    postItem.addEventListener('click', (e) => {

      const postItemUrl = `post-detail.html?postId=${obj.id}`;

      window.location = postItemUrl;
    })
  }

  //set event click btn edit

  const postItemEditBtn = postItemElement.querySelector('#postItemEdit');
  if (postItemEditBtn) {
    postItemEditBtn.addEventListener('click', (e) => {

      const postItemUrl = `add-edit-post.html?postId=${obj.id}`;

      window.location = postItemUrl;

      e.stopPropagation();
    })
  }

  //set event click remove btn
  const postItemRemoveBtn = postItemElement.querySelector('#postItemRemove');
  if (postItemRemoveBtn) {
    postItemRemoveBtn.addEventListener('click', (e) => {

      handleRemoveBtnClick(e, obj);

      e.stopPropagation();
    })
  }

  return postItemElement;

}


const postPagionation = async (pagination) => {
  const { _page, _limit, _totalRows } = pagination;

  const config = {
    _page,
    _limit,
    _totalRows
  }
  const totalPage = Math.ceil(config._totalRows / config._limit);

  const pre = document.querySelector('.pre');
  const next = document.querySelector('.next');

  if (pre) {

    if (config._page > 1) {
      console.log('hello');
      pre.classList.remove('disabled');
    }

    pre.addEventListener('click', (e) => {
      let prePage = (config._page - 1) >= 1 ? --config._page : config._page;

      pre.href = `?_page=${prePage}&_limit=${_limit}`;

    });
  }
  if (next) {
    if (config._page === totalPage) {
      console.log('hello');
      next.classList.add('disabled');
    }
    next.addEventListener('click', (e) => {
      let nextPage = (config._page + 1) < totalPage ? ++config._page : totalPage;

      // e.preventDefault();
      // if (config._page === totalPage) {
      //   next.classList.add('disabled');
      // }
      next.href = `?_page=${nextPage}&_limit=${_limit}`;
    });
  }
}
221
const showText = () => {
  document.querySelector('.text-load').style.display = 'block';
  document.querySelector('.posts-nav').style.display = 'block';
}
const hideLoad = () => {
  document.querySelector('.loading').style.display = 'none';
}
// -----------------------
// MAIN LOGIC
// -----------------------
const init = async () => {


  //post detail -> lấy postId -> fetch postdetail -> render post -> update edit link

  // fetch data -> loop data -> render -> event -> click -> e.stopPropagation() on edit -> update addlink 
  // add update - get post id , get post detail , fill form banner - handle form submit - update post -update viewdetail link

  console.log(location.search);

  try {


    const limit = new URLSearchParams(window.location.search).get('_limit');
    const page = new URLSearchParams(window.location.search).get('_page');

    const params = {
      _sort: 'updatedAt',
      _order: 'desc',
      _limit: limit || 6,
      _page: page || 1,
    }
    const paramsString = new URLSearchParams(params);
    const datas = await postApi.getAll(paramsString.toString());
    const postsList = getPostList();
    console.log(datas);
    // because reponse return obj 
    const { data, pagination } = datas;

    if (data && postsList && pagination) {
      // showLoad();
      console.log(document.querySelector('.loading'));
      postPagionation(pagination);
      if (Array.isArray(data)) {
        for (const item of data) {
          const postItemElement = buildPostItem(item);
          if (postItemElement) {
            postsList.appendChild(postItemElement);
          } else {
            console.log('lỗi nè');
          }
        }
      }

      anime({
        targets: 'ul.posts-list > li',
        translateY: [
          { value: 250, duration: 0 },
          { value: 0, duration: 750 },
        ],
        delay: anime.stagger(150),
        easing: 'linear',
      });

    };
  } catch (error) {
    console.log('Lỗi nè', error);

  } finally {
    hideLoad();
    showText();
  }

}

init();

