select title, content, img, profile_pic as author_pic, username as author from helo_post p 
join helo_users u on u.id = p.author_id
where p.id = $1;
