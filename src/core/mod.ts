import { BaseContext } from "my_grammy"

export function getPhotoId(src: BaseContext) {
  const photo = src.message?.photo
  if (!photo) throw new Error("No message photo")
  return photo[photo.length - 1].file_id
}
