export default class {
  preControllerInit() {
    return new Promise((resolve, reject) => {
      try {
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }
}
