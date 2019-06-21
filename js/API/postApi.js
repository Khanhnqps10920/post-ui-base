import fetchClient from './fetchClient.js';
import AppConstants from '../appConstants.js';

class PostApi {

  getResourceName() {
    return 'posts';
  }

  getAll() {

    const url = `${AppConstants.API_URL}/${this.getResourceName()}`;
    return fetchClient.get(url);

  }

  getDetail(postId) {

    const url = `${AppConstants.API_URL}/${this.getResourceName()}/${postId}`;
    return fetchClient.get(url);

  }

  add(post) {

    const url = `${AppConstants.API_URL}/${this.getResourceName()}`;
    return fetchClient.get(url, post);

  }

  update(post) {

    const url = `${AppConstants.API_URL}/${this.getResourceName()}/${post.id}`;
    return fetchClient.patch(url, post);

  }

  remove(postId) {

    const url = `${AppConstants.API_URL}/${this.getResourceName()}/${post.id}`;
    return fetchClient.delete(url);

  }

}

const postApi = new PostApi();

export default postApi;