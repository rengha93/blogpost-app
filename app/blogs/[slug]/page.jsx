import client from "@/lib/contentfulClient";
import { processContentfulResponse } from "@/lib/contentfulUtils";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";
import Image from "next/image";
import Link from "next/link";
import { notFound } from 'next/navigation';

export default async function BlogPostPage({ params }) {
    const { slug } = params;
    let blogPost = null;


    const response = await client.getEntries({
        content_type: 'blogPost',
        'fields.slug': slug,
        include: 10,
        limit: 1,
    }).catch((error) => {
        throw error;
    });
    if (response.items.length > 0) {
        const singleItemResponse = {
            items: [response.items[0]],
            includes: response.includes
        };
        const processed = processContentfulResponse(singleItemResponse);
        if (processed && processed.length > 0) {
            blogPost = processed[0];
        }
    }

    if (!blogPost) {
        notFound();  
    }

    const options = {
        renderMark: {
            [MARKS.BOLD]: (text) => <strong className="font-bold">{text}</strong>,
            [MARKS.ITALIC]: (text) => <em className="italic">{text}</em>,
        },
        renderNode: {
            [BLOCKS.PARAGRAPH]: (node, children) => <p className="mb-4 text-lg leading-relaxed">{children}</p>,
            [BLOCKS.HEADING_1]: (node, children) => <h1 className="text-4xl font-extrabold mb-6 mt-10">{children}</h1>,
            [BLOCKS.HEADING_2]: (node, children) => <h2 className="text-3xl font-bold mb-5 mt-8">{children}</h2>,
            [BLOCKS.UL_LIST]: (node, children) => <ul className="list-disc pl-5 mb-4">{children}</ul>,
            [BLOCKS.OL_LIST]: (node, children) => <ol className="list-decimal pl-5 mb-4">{children}</ol>,
            [BLOCKS.LIST_ITEM]: (node, children) => <li className="mb-2">{children}</li>,
            [BLOCKS.EMBEDDED_ASSET]: (node) => {
                const asset = blogPost?.linkedAssets?.find((asset) => asset.sys.id === node.data.target.sys.id);
                if (asset && typeof asset.url === "string" && asset.url.length > 0) {
                    return (
                        <div className="my-8">
                            <img src={asset.url} alt={asset.description || asset.title || "Embedded image"} className="max-w-full h-auto rounded-lg shadow-md mx-auto" />
                            {asset.description && <p className="text-center text-sm text-gray-500 mt-2">{asset.description}</p>}
                        </div>
                    );
                }
                return null;
            },
            [INLINES.HYPERLINK]: (node, children) => {
                return (
                    <a href={node.data.uri} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                        {children}
                    </a>
                );
            },

            [BLOCKS.EMBEDDED_ENTRY]: (node) => {
                const entry = blogPost?.linkedEntries?.find((entry) => entry.sys.id === node.data.target.sys.id);
                if (entry) {

                    if (entry.sys.contentType.sys.id === 'author') {
                        return (
                            <div className="p-4 border rounded-lg bg-gray-50 my-6">
                                <h3 className="font-bold">About the Author: {entry.name}</h3>
                                <p>{entry.bio}</p>
                                {entry.profilePictureUrl && typeof entry.profilePictureUrl === "string" && entry.profilePictureUrl.length > 0 && (
                                    <img src={entry.profilePictureUrl} alt={entry.name} width={50} height={50} className="rounded-full mt-2" />
                                )}
                            </div>
                        );
                    }
                  
                    return null;
                }
                return null;
            }
        },
    };

    return (
        <div className="max-w-3xl mx-auto py-12 px-4">
            <h1 className="text-3xl sm:text-5xl font-extrabold mb-6 text-gray-900 dark:text-white">{blogPost.title}</h1>
            {blogPost.author && (
                <p className="text-lg text-gray-700 dark:text-white mb-4">By
                    <span className="font-semibold pl-2 dark:text-white">{blogPost.author.name}</span>
                    <span className="ml-4 text-md text-black dark:text-white">{blogPost.timeToRead}</span>
                    <span className="ml-2 text-black dark:text-white">&middot;</span>
                    <span className="ml-2 text-md text-black dark:text-white">{blogPost.publishedDate}</span>
                </p>
            )}
            {blogPost.featuredImageUrl && typeof blogPost.featuredImageUrl === "string" && blogPost.featuredImageUrl.length > 0 && (
                <div className="mb-8">
                    {blogPost.featuredImageUrl && (
                        <Image src={blogPost.featuredImageUrl} alt={blogPost.title} width={300} height={300} className="w-full h-full object-cover rounded-lg shadow-lg" />
                    )}
                </div>
            )}
            <p className="text-xl text-gray-600 italic mb-10 dark:text-white">{blogPost.excerpt}</p>

            <div className="prose lg:prose-xl text-gray-800 dark:text-white">
                {blogPost.content && documentToReactComponents(blogPost.content, options)}
            </div>

            <div className="mt-12 text-center">
                <Link href="/blogs" className="text-black hover:underline text-lg dark:text-white">
                    &larr; Back to all blog posts
                </Link>
            </div>
        </div>
    );
}