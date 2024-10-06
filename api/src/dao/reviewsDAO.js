const { ObjectId } = require("mongodb");
const { models } = require("../lib/models");

let reviews;

class ReviewsDAO {
  static async injectDB(db) {
    if (reviews) return;
    try {
      reviews = await db.collection(models.reviews);
    } catch (e) {
      console.error(`Unable to establish collection handles in ReviewsDAO: ${e}`);
    }
  }

  static async getOneById(id) {
    try {
      return await reviews.findOne({ _id: new ObjectId(id) });
    } catch (e) {
      console.error(`Unable to get review: ${e}`);
      return { error: e };
    }
  }

  static async getOneByCardAndUser(cardId, userId) {
    try {
      return await reviews.findOne({
        cardId: new ObjectId(cardId),
        userId: new ObjectId(userId),
      });
    } catch (e) {
      console.error(`Unable to get review: ${e}`);
      return { error: e };
    }
  }

  static async createOne({
    cardId,
    userId,
    rating,
    title,
    content,
    createdAt = new Date(),
    updatedAt = new Date(),
  }) {
    try {
      return await reviews.insertOne({
        cardId: new ObjectId(cardId),
        userId: new ObjectId(userId),
        rating,
        title,
        content,
        createdAt,
        updatedAt,
      });
    } catch (e) {
      console.error(`Unable to create review: ${e}`);
      return { error: e };
    }
  }

  static async getManyByField({
    field,
    value,
    sort = "createdAt",
    page = 0,
    perPage = 20,
  } = {}) {
    try {
      return await reviews
        .find({ [field]: value })
        .sort({ [sort]: -1 })
        .skip(perPage * page)
        .limit(perPage)
        .toArray();
    } catch (e) {
      console.error(`Unable to get reviews: ${e}`);
      return { error: e };
    }
  }
}

module.exports = ReviewsDAO;