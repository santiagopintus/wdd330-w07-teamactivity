/* LocalStorage useful functions */
import { saveToLS, getFromLS } from "./ls.js";

class CommentModel {
  constructor(type) {
    this.type = type;
    this.comments = getFromLS(this.type) || [];
  }

  /* One function for getting all comments or filtered */
  getComments(name = null) {
    if (this.comments.length === 0) {
      return null;
    }
    if (name) {
      return this.comments.filter((com) => com.name === name) || null;
    }
    return this.comments;
  }

  /* Adding new comments to LS */
  addComment(name, content) {
    this.comments.push({
      name: name,
      content: content,
      date: new Date(),
    });
    saveToLS(this.type, this.comments);
  }
}

/* Comments VIEW */
class CommentView {
  constructor(type, commentsForm) {
    this.type = type;
    this.form = commentsForm;
  }
  /* To show comments in the specified parent element */
  renderCommentList(comments, parent) {
    /* Remove old comments */
    parent.innerHTML = "";
    /* Writing new comments */
    comments.forEach((com) => {
      const $comment = document.createElement("li");
      $comment.classList.add("comment-container");
      $comment.innerHTML = `<p>${com.name}: ${com.content}</p>`;
      parent.appendChild($comment);
    });
  }
  showEmptyMsg(parentE) {
    parentE.innerHTML = `
      <li>
        <p>There are no comments to show</p>
      </li>`;
  }
  showForm(show) {
    let $form = document.getElementById(this.form);
    if ($form) {
      show ? $form.classList.add("show") : $form.classList.remove("show");
    }
  }
}

/* Comments Controller */
class Comments {
  constructor(type, parentListId) {
    this.type = type;
    this.parentListId = parentListId;
    this.model = new CommentModel(this.type);
    this.view = new CommentView(this.type, "commentsForm");
  }
  /* Loads list of comments depending on the current view */
  showCommentsList(name = null) {
    const $parentList = document.getElementById(this.parentListId);
    /* Shows or hide the form */
    this.view.showForm(name);
    /* Listening to submit btn */
    this.listenToSubmit(name);

    /* If there are comments, show them */
    if ($parentList) {
      if (this.model.getComments()) {
        /* getComments() check if name is defined */
        let filteredComments = this.model.getComments(name);
        filteredComments.length > 0 && filteredComments !== null
          ? this.view.renderCommentList(filteredComments, $parentList)
          : this.view.showEmptyMsg($parentList);
      } else {
        this.view.showEmptyMsg($parentList);
      }
    } else {
      throw new Error(`Couldn't find parent: "${this.parentListId}"`);
    }
  }
  /* Listen to submit button */
  listenToSubmit(name) {
    if (name) {
      const $commentEntry = document.getElementById("commentEntry");
      document.getElementById("commentSubmit").onclick = () => {
        if ($commentEntry.value.length > 0) {
          this.model.addComment(name, $commentEntry.value);
          $commentEntry.value = "";
          this.showCommentsList(name);
        } else {
          const $errorMsg = document.getElementById("errorMsg");
          $errorMsg.classList.add("show");
          setTimeout(() => {
            $errorMsg.classList.remove("show");
          }, 3000);
        }
      };
    }
  }
}

export default Comments;
