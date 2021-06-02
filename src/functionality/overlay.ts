// // DOWNLOADS NEW IMAGE
// const downloadImage = (image, index) => {
//     index = index || document.querySelectorAll(".images_holder__image").length;
//     const asyncLoadImage = new Image();
//     asyncLoadImage.src = image;
   
//     asyncLoadImage.onload = () => {
//         const outerDiv = document.createElement("div");
//         outerDiv.style.order = index;
//         outerDiv.setAttribute("id", index);
//         outerDiv.setAttribute("class", "image_holder__holder");
    
//         const optionsDiv = document.createElement("div");
//         optionsDiv.setAttribute("class", "image_holder__options");
   
//         // REORDER LEFT
//         const reorderLeftDiv = document.createElement("div");
//         reorderLeftDiv.setAttribute("class", "images_holder__arrow images_holder__arrow_left");
//         reorderLeftDiv.innerText = `←`;
//         reorderLeftDiv.addEventListener("click", (e) => {
//             const currentPlace = parseInt(outerDiv.style.order);
//             if (currentPlace > 0) {
//                 document.querySelectorAll(".image_holder__holder").forEach((item) => {
//                 if (parseInt(item.style.order) + 1 == currentPlace) {
//                     return (item.style.order = currentPlace);
//                 } else {
//                     return null;
//                 }
//                 });
   
//             outerDiv.style.order = currentPlace - 1;
//             reorderImage(currentPlace, "LEFT");
//             } else {
//                 console.log("cant move that");
//             }
//         });
//         optionsDiv.appendChild(reorderLeftDiv);

//         // REMOVE
//         const removeDiv = document.createElement("div");
//         removeDiv.setAttribute("class", "images_holder__remove");
//         removeDiv.innerText = `Remove`;
//         removeDiv.addEventListener("click", async (e) => {
//             // CHANGE ORDER OF REMAINING IMAGES
//             const currentOrder = parseInt(outerDiv.style.order);
//             await document.querySelectorAll(".image_holder__holder").forEach((item) => {
//                 if (parseInt(item.style.order) - 1 >= currentOrder) {
//                     return (item.style.order = parseInt(item.style.order) - 1);
//                 } else { 
//                     return null;
//                 }
//             });
    
//                 // REMOVE THE IMAGE
//                 await removeImage(outerDiv.style.order);
//                 await outerDiv.remove();
//         });

//         optionsDiv.appendChild(removeDiv);
   
//         // REORDER RIGHT
//         const reorderRightDiv = document.createElement("div");
//         reorderRightDiv.setAttribute("class", "images_holder__arrow images_holder__arrow_right");
//         reorderRightDiv.innerText = `→`;
//         reorderRightDiv.addEventListener("click", (e) => {
//             //    removeImage(outerDiv.style.order);
//             const currentPlace = parseInt(outerDiv.style.order);
//             if (currentPlace < document.querySelectorAll(".image_holder__holder").length - 1) {
//                 document.querySelectorAll(".image_holder__holder").forEach((item) => {
//                     if (parseInt(item.style.order) - 1 == currentPlace) {
//                         return (item.style.order = currentPlace);
//                     } else return null;
//                 });
        
//                 outerDiv.style.order = currentPlace + 1;
//                 reorderImage(currentPlace, "RIGHT");
//             } else {
//                 console.log("cant move that");
//             }
//         });
//         optionsDiv.appendChild(reorderRightDiv);
   
//         // IMAGE
//         const innerDiv = document.createElement("img");
//         innerDiv.setAttribute("data-uri", image);
//         innerDiv.setAttribute("class", "images_holder__image");
//         innerDiv.src = image;
//         innerDiv.addEventListener("click", (e) => {
//             showImage(e.target.dataset.uri);
//         });
   
//         // APPEND AND WRAPUP
//         outerDiv.appendChild(optionsDiv);
//         outerDiv.appendChild(innerDiv);
//         images_holder.appendChild(outerDiv);
//         image_url.value = "";
//     };
   
//     asyncLoadImage.addEventListener("error", () => {
//         console.log("Image did not load");
//     });
// };