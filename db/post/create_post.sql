insert into helo_post (author_id, title, img, content, date_created, upvotes)
values ($1, $2, $3, $4, $5, 0)
returning *;