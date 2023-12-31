const generatorForm = document.querySelector(".generator-form");
const imageGallery = document.querySelector(".Image-gallery");
const OPENAI_API_KEY = "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";
let isImageGenerating = false;
const updateImageCard = (ImageDataArray) => {
  ImageDataArray.forEach((imgObject, index) => {
    const imgCard = imageGallery.querySelectorAll(".img-card")[index];
    const imgElement = imgCard.querySelector("img");
    const downloadBtn = imgCard.querySelector(".download-btn");
    // Set the image source to the AI-generated image data
    const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
    imgElement.src = aiGeneratedImg;
    // When the image is loaded, remove the loading class and set download attributes
    imgElement.onload = () => {
      imgCard.classList.remove("loading");
      downloadBtn.setAttribute("href", aiGeneratedImg);
      downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
    };
  });
};
const generateAiImages = async (userPrompt, userImgQuantity) => {
  try {
    // Send a request to the OpenAI API to generate images based on user inputs
    const response = await fetch("https://api.openai.com/v1/images/generations"

,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: userPrompt,
          n: parseInt(userImgQuantity),
          size: "256x256",
          response_format: "b64_json",
        }),
      }
    );
    if (!response.ok)
      throw new Error(
        "Failed to generate AI images. Make sure your API key is valid."
      );
    const { data } = await response.json(); //Get data from the response
    updateImageCard([...data]);
  } catch (error) {
    alert(error.massage);
  } finally {
    isImageGenerating = false;
  }
};
const handleFormSubmission = (e) => {
  e.preventDefault();
  if (isImageGenerating) return;
  isImageGenerating = true;
  // Get user input and image quantity values From the form
  const userPrompt = e.srcElement[0].value;
  const userImgQuantity = e.srcElement[1].value;
  // Creating HTML markup for image cards with loading state
  const imgCardMarkup = Array.from(
    { length: userImgQuantity },
    () =>
      `      <div class="img-card loading">
    <img src="images/loader.svg" alt="img" loading="lazy">
    <a href="#" class="download-btn">
        <img src="images/download.svg" alt="download icon" loading="lazy">
    </a>
</div>`
  ).join("");
  imageGallery.innerHTML = imgCardMarkup;
  generateAiImages(userPrompt, userImgQuantity);
};
generatorForm.addEventListener("submit", handleFormSubmission);
