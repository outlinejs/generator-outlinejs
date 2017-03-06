export default class {
  processRequest(request, response) {
    return new Promise((resolve, reject) => {
      try {
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }
}
