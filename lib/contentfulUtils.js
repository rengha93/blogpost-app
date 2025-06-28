export function processContentfulResponse(apiResponse) {
  const assetMap = {};
  const entryMap = {};

  if (apiResponse.includes && apiResponse.includes.Asset) {
    apiResponse.includes.Asset.forEach((asset) => {
      assetMap[asset.sys.id] = asset;
    });
  }

  if (apiResponse.includes && apiResponse.includes.Entry) {
    apiResponse.includes.Entry.forEach((entry) => {
      entryMap[entry.sys.id] = entry;
    });
  }

  const processedItems = apiResponse.items.map((blogPost) => {
    const fields = blogPost.fields;
    let featuredImageUrl = null;
    if (fields.featuredImage?.sys?.id) {
      const imageAsset = assetMap[fields.featuredImage.sys.id];
      if (imageAsset?.fields?.file?.url) {
        featuredImageUrl = `https:${imageAsset.fields.file.url}`;
      }
    }

    let author = null;
    if (fields.author?.sys?.id) {
      const authorEntry = entryMap[fields.author.sys.id];
      if (authorEntry?.fields) {
        let authorProfilePicUrl = null;
        if (authorEntry.fields.profilePicture?.sys?.id) {
          const profilePicAsset = assetMap[authorEntry.fields.profilePicture.sys.id];
          if (profilePicAsset?.fields?.file?.url) {
            authorProfilePicUrl = `https:${profilePicAsset.fields.file.url}`;
          }
        }
        author = {
          name: authorEntry.fields.name,
          bio: authorEntry.fields.bio,
          profilePictureUrl: authorProfilePicUrl,
        };
      }
    }

    const categories = [];
    if (Array.isArray(fields.category)) {
      fields.category.forEach((catLink) => {
        if (catLink.sys?.id) {
          const categoryEntry = entryMap[catLink.sys.id];
          if (categoryEntry?.fields) {
            categories.push({
              name: categoryEntry.fields.name,
              slug: categoryEntry.fields.slug,
            });
          }
        }
      });
    }

    let tag = null;
    if (fields.tag?.sys?.id) {
      const tagEntry = entryMap[fields.tag.sys.id];
      if (tagEntry?.fields) {
        tag = {
          name: tagEntry.fields.name,
          slug: tagEntry.fields.slug,
        };
      }
    }

    const content = fields.content;
    const formattedDate = formatDate(fields.publishedDate);

    return {
      id: blogPost.sys.id,
      title: fields.title,
      slug: fields.slug,
      excerpt: fields.excerpt,
      publishedDate: formattedDate,
      featuredImageUrl: featuredImageUrl,
      author: author,
      categories: categories,
      tag: tag,
      content: content,
      timeToRead: fields.timeToRead,
    };
  });
  return processedItems;
}

export function formatDate(dateString) {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return null;
  }
}
