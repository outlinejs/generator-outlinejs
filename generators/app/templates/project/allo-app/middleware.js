export default class {
  processRequest(request, response) {
    return new Promise((resolve, reject) => {
      try {
        console.log('\'Allo \'Allo');
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }
}
