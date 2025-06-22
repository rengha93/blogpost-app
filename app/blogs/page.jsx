import client from "@/lib/contentfulClient";
import { processContentfulResponse } from "@/lib/contentfulUtils";
import Image from "next/image";
import Link from "next/link";


export default async function BlogPost() {

    let blogPosts = [];
    const response = await client.getEntries({
        content_type: 'blogPost',
        select: ['fields.title,fields.slug,fields.excerpt,fields.featuredImage,fields.tag,fields.category,fields.author,fields.publishedDate,fields.timeToRead'],
        include: 10,
    }).catch((error) => {
        console.error("[FETCH ERROR]", error);
        throw error;
    });

    blogPosts = processContentfulResponse(response);

    return (
        <div className="max-w-5xl">
            <div className="blog-posts-grid">
                {blogPosts.length > 0 ? (
                    blogPosts.map((post) => (
                        <div key={post.id} className="py-4 my-5 border-b border-gray-10">
                            <div className="flex flex-row items-center mb-2">
                                {post.author?.profilePictureUrl && (
                                    <Image
                                        className="relative w-[20px] h-[20px] rounded-full overflow-hidden object-cover"
                                        src={post.author.profilePictureUrl}
                                        width={20}
                                        height={20}
                                        alt={'author_picture'}
                                    />
                                )}
                                <p className="ml-2 text-sm font-bold text-black dark:text-white">
                                    {post.author ? post.author.name : "Anonymous"}
                                </p>
                            </div>

                            <div className="grid grid-cols-4 gap-4">
                                <div className="col-span-3">
                                    <Link href={`/blogs/${post.slug}`} className="cursor-pointer">
                                        <h2 className="text-sm md:text-4xl font-bold mb-2 sm:mb-4">{post.title}</h2>
                                    </Link>
                                    <p className="text-sm md:text-md text-neutral-500 dark:text-gray-200 py-0.5 sm:py-2">{post.excerpt}</p>
                                    {post.tag && <p className="inline-block bg-gray-100 mt-2 text-gray-800 dark:bg-gray-700 dark:text-gray-200 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-gray-200">{post.tag.name}</p>}
                                </div>

                                <div className="col-span-1 flex justify-center items-start sm:items-center">
                                    <div className="relative sm:ml-12 w-full h-[200px]">
                                        {post.featuredImageUrl && (
                                            <Image
                                                className="relative h-[100px] sm:h-[200px] overflow-hidden object-cover"
                                                src={post.featuredImageUrl}
                                                alt={post.title}
                                                width={200}
                                                height={200}
                                                objectFit="cover"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No blog posts found.</p>
                )}
            </div>
        </div>
    );
}
