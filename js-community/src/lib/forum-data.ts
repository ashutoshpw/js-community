import { and, asc, desc, eq, isNull, sql } from "drizzle-orm";
import * as schema from "@/db/schema";
import { db } from "@/lib/database";

export type ForumCategory = {
  id: number;
  name: string;
  slug: string;
  color: string;
  textColor: string;
  description: string | null;
  position: number;
  parentCategoryId: number | null;
  topicCount: number;
  subcategories: Array<{
    id: number;
    name: string;
    slug: string;
    color: string;
    textColor: string;
    description: string | null;
    position: number;
    parentCategoryId: number | null;
    topicCount: number;
  }>;
};

export type ForumTopicListResponse = {
  topics: Array<{
    id: number;
    title: string;
    slug: string;
    views: number;
    postsCount: number;
    replyCount: number;
    likeCount: number;
    pinned: boolean;
    pinnedGlobally: boolean;
    closed: boolean;
    archived: boolean;
    createdAt: Date;
    lastPostedAt: Date | null;
    bumpedAt: Date | null;
    author: {
      id: number;
      username: string;
      name: string | null;
    };
    category: {
      id: number;
      name: string;
      slug: string;
      color: string;
    } | null;
  }>;
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

export async function getForumCategories(): Promise<ForumCategory[]> {
  const categories = await db
    .select({
      id: schema.categories.id,
      name: schema.categories.name,
      slug: schema.categories.slug,
      color: schema.categories.color,
      textColor: schema.categories.textColor,
      description: schema.categories.description,
      position: schema.categories.position,
      parentCategoryId: schema.categories.parentCategoryId,
      topicCount: sql<number>`count(distinct ${schema.topics.id})`.as(
        "topic_count",
      ),
    })
    .from(schema.categories)
    .leftJoin(schema.topics, eq(schema.topics.categoryId, schema.categories.id))
    .groupBy(schema.categories.id)
    .orderBy(asc(schema.categories.position), asc(schema.categories.id));

  const parentCategories = categories.filter(
    (category) => !category.parentCategoryId,
  );
  const childCategories = categories.filter(
    (category) => category.parentCategoryId,
  );

  return parentCategories.map((category) => ({
    ...category,
    subcategories: childCategories.filter(
      (child) => child.parentCategoryId === category.id,
    ),
  }));
}

export async function getForumCategoryBySlug(
  slug: string,
): Promise<ForumCategory | null> {
  const categories = await getForumCategories();

  for (const category of categories) {
    if (category.slug === slug) {
      return category;
    }

    const subcategory = category.subcategories.find(
      (item) => item.slug === slug,
    );
    if (subcategory) {
      return {
        ...subcategory,
        subcategories: [],
      };
    }
  }

  return null;
}

export async function getForumTopics({
  page = 1,
  perPage = 20,
  sort = "latest",
  categorySlug,
}: {
  page?: number;
  perPage?: number;
  sort?: string;
  categorySlug?: string;
}): Promise<ForumTopicListResponse> {
  const safePage = Math.max(1, page);
  const safePerPage = Math.min(50, Math.max(1, perPage));
  const offset = (safePage - 1) * safePerPage;
  const conditions = [
    eq(schema.topics.visible, true),
    isNull(schema.topics.deletedAt),
  ];

  if (categorySlug) {
    const [category] = await db
      .select({ id: schema.categories.id })
      .from(schema.categories)
      .where(eq(schema.categories.slug, categorySlug))
      .limit(1);

    if (!category) {
      return {
        topics: [],
        pagination: {
          page: safePage,
          perPage: safePerPage,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: safePage > 1,
        },
      };
    }

    conditions.push(eq(schema.topics.categoryId, category.id));
  }

  const orderBy =
    sort === "top"
      ? desc(schema.topics.likeCount)
      : sort === "new"
        ? desc(schema.topics.createdAt)
        : desc(schema.topics.bumpedAt);

  const topics = await db
    .select({
      id: schema.topics.id,
      title: schema.topics.title,
      slug: schema.topics.slug,
      views: schema.topics.views,
      postsCount: schema.topics.postsCount,
      replyCount: schema.topics.replyCount,
      likeCount: schema.topics.likeCount,
      pinned: schema.topics.pinned,
      pinnedGlobally: schema.topics.pinnedGlobally,
      closed: schema.topics.closed,
      archived: schema.topics.archived,
      createdAt: schema.topics.createdAt,
      lastPostedAt: schema.topics.lastPostedAt,
      bumpedAt: schema.topics.bumpedAt,
      authorId: schema.users.id,
      authorUsername: schema.users.username,
      authorName: schema.users.name,
      categoryId: schema.categories.id,
      categoryName: schema.categories.name,
      categorySlug: schema.categories.slug,
      categoryColor: schema.categories.color,
    })
    .from(schema.topics)
    .innerJoin(schema.users, eq(schema.topics.userId, schema.users.id))
    .leftJoin(
      schema.categories,
      eq(schema.topics.categoryId, schema.categories.id),
    )
    .where(and(...conditions))
    .orderBy(desc(schema.topics.pinned), orderBy)
    .limit(safePerPage)
    .offset(offset);

  const [countResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.topics)
    .where(and(...conditions));

  const total = Number(countResult?.count || 0);
  const totalPages = total > 0 ? Math.ceil(total / safePerPage) : 1;

  return {
    topics: topics.map((topic) => ({
      id: topic.id,
      title: topic.title,
      slug: topic.slug,
      views: topic.views,
      postsCount: topic.postsCount,
      replyCount: topic.replyCount,
      likeCount: topic.likeCount,
      pinned: topic.pinned,
      pinnedGlobally: topic.pinnedGlobally,
      closed: topic.closed,
      archived: topic.archived,
      createdAt: topic.createdAt,
      lastPostedAt: topic.lastPostedAt,
      bumpedAt: topic.bumpedAt,
      author: {
        id: topic.authorId,
        username: topic.authorUsername || "[deleted]",
        name: topic.authorName,
      },
      category:
        topic.categoryId &&
        topic.categoryName &&
        topic.categorySlug &&
        topic.categoryColor
          ? {
              id: topic.categoryId,
              name: topic.categoryName,
              slug: topic.categorySlug,
              color: topic.categoryColor,
            }
          : null,
    })),
    pagination: {
      page: safePage,
      perPage: safePerPage,
      total,
      totalPages,
      hasNext: safePage < totalPages,
      hasPrev: safePage > 1,
    },
  };
}
