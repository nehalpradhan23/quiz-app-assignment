export const DB_NAME = "QuizDB";
export const STORE_NAME = "questionsStore";
export const VERSION = 1;

// ✅ Open IndexedDB Connection
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" }); // Ensure each question has an "id"
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("Error opening database");
  });
};

// ✅ Get Questions from IndexedDB
export const getQuestionsFromDB = async () => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () =>
        reject("Failed to fetch questions from IndexedDB");
    });
  } catch (error) {
    console.error("IndexedDB error:", error);
    return [];
  }
};

// ✅ Save Questions to IndexedDB
export const saveQuestionsToDB = async (questions) => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    store.clear(); // Clear existing data before saving new questions

    questions.forEach((question) => {
      store.put(question); // Ensure each question has an "id" field
    });

    return new Promise((resolve) => {
      transaction.oncomplete = () => resolve("Questions saved!");
    });
  } catch (error) {
    console.error("Error saving questions:", error);
  }
};
