import tags from '../config/base.tags';
import tagRepository from '../repositories/tag.repository';
import { CreateTagDto } from '../dto/tags/create.tag.dto';

class TagService {
  /**
   *
   * @param userId (in the body)
   * @returns tags []
   * @comment This function will grab from the array that contains
   * @comment the base tags, check the users tags and send all the
   * @comment tags that user doens't yet have
   */
  async listAllUserAvailableTags(userId: string) {
    const res = await tagRepository.getUserTags(Number(userId));
    const userTags = res.rows as CreateTagDto[];

    /**
     * Filter to return only tags not already in user tag list
     */
    const allTags: CreateTagDto[] = [];
    tags.forEach((tag) => {
      let includes = false;
      /**
       * forEach() loop cannot be used here because is not
       * possible to break from a forEach() loop
       */
      for (let i = 0; i < userTags.length; i++) {
        if (tag.id === userTags[i].id) {
          includes = true;
          /**
           * Remove tag from userTags array to not check
           * the same tag for all the remaining tags in the
           * tags array. (tags are unique).
           */
          userTags.splice(i, 1);
          break;
        }
      }
      if (!includes) {
        allTags.push(tag);
      }
    });

    return allTags;
  }

  async create(tag: CreateTagDto) {
    const userTags = await tagRepository.getUserTags(Number(tag.user_id));
    const tags: CreateTagDto[] = userTags.rows;

    const t = tags.filter((userTag) => userTag.id === tag.id)[0];
    /**
     * Add tag if tag is not already in user tag list
     */
    if (!t && tags.length < 5) {
      const res = await tagRepository.create(tag);
      return res.rowCount;
    }
    return 0;
  }

  async getUserTags(userId: string) {
    const res = await tagRepository.getUserTags(Number(userId));

    return res.rows as CreateTagDto[];
  }

  async delete(userId: string, tagId: string) {
    const res = await tagRepository.delte(Number(tagId), Number(userId));
    return res.rowCount;
  }
}

export default new TagService();
