// Older posts only have a single `imageURL`; newer ones carry a `media` array
// with images and/or videos. Normalize both shapes into one list.
export const getPostMedia = (postData) => {
    if (postData.media && postData.media.length > 0) {
        return postData.media;
    }
    if (postData.imageURL) {
        return [{ url: postData.imageURL, type: 'image' }];
    }
    return [];
};
