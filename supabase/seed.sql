-- Generated from app/lib/menu-data.ts. Safe to re-run.

insert into menu_types (slug, title, description, photo, position) values
  ('furshet', '{"uk":"Фуршет","en":"Фуршет"}', '{"en":"Canapés and small bites for standing receptions, presentations and celebrations without a seating plan.","uk":"Канапе та дрібні закуски для прийомів, презентацій і свят без розсадки."}', '/photo/340845283_535135425228599_8845032591361743684_n.jpg', 1),
  ('banquet', '{"uk":"Банкет","en":"Банкет"}', '{"en":"Composed courses served at the table, for weddings, anniversaries and formal dinners.","uk":"Страви, подані до столу, — для весіль, ювілеїв і офіційних вечер."}', '/photo/405926522_7104475096271096_3953933040856888595_n.jpg', 2)
on conflict (slug) do nothing;

insert into categories (menu_type_id, slug, title, position) values
  ((select id from menu_types where slug = 'furshet'), 'cold', '{"en":"Cold appetizers","uk":"Холодні закуски"}', 1),
  ((select id from menu_types where slug = 'furshet'), 'hot', '{"en":"Hot appetizers","uk":"Гарячі закуски"}', 2),
  ((select id from menu_types where slug = 'furshet'), 'desserts', '{"en":"Desserts","uk":"Десерти"}', 3),
  ((select id from menu_types where slug = 'banquet'), 'cold', '{"en":"Cold appetizers","uk":"Холодні закуски"}', 1),
  ((select id from menu_types where slug = 'banquet'), 'main', '{"en":"Main courses","uk":"Основні страви"}', 2),
  ((select id from menu_types where slug = 'banquet'), 'desserts', '{"en":"Desserts","uk":"Десерти"}', 3)
on conflict (menu_type_id, slug) do nothing;

insert into dishes (slug, title, description) values
  ('tartare', '{"en":"Beef tartare","uk":"Тартар з яловичини"}', '{"en":"Hand-cut beef, capers, egg yolk, toasted sourdough.","uk":"Яловичина ручного зрізу, каперси, жовток, підсмажений хліб на заквасці."}'),
  ('salmon-canape', '{"en":"Salmon canapé","uk":"Канапе з лососем"}', '{"en":"Cured salmon, crème fraîche, dill, rye crisp.","uk":"Слабосолений лосось, крем-фреш, кріп, житній хрусткий хліб."}'),
  ('lamb', '{"en":"Slow-cooked lamb","uk":"Томлена баранина"}', '{"en":"Shoulder braised for six hours, celeriac purée, jus.","uk":"Лопатка, томлена шість годин, пюре з селери, соус."}'),
  ('panna-cotta', '{"en":"Panna cotta","uk":"Панакота"}', '{"en":"Vanilla cream, seasonal berries.","uk":"Вершки з ваніллю, сезонні ягоди."}'),
  ('bruschetta', '{"en":"Mushroom bruschetta","uk":"Брускета з грибами"}', '{"en":"Roasted mushrooms, thyme, aged cheese on toasted sourdough.","uk":"Печені гриби, чебрець, витриманий сир на підсмаженій заквасці."}'),
  ('shrimp-skewer', '{"en":"Prawn skewer","uk":"Шпажка з креветкою"}', '{"en":"Grilled prawn, lemon zest, herb oil.","uk":"Креветка на грилі, цедра лимона, трав''яна олія."}'),
  ('profiteroles', '{"en":"Profiteroles","uk":"Профітролі"}', '{"en":"Choux pastry, vanilla cream, dark chocolate.","uk":"Заварне тісто, ванільний крем, чорний шоколад."}'),
  ('carpaccio', '{"en":"Beef carpaccio","uk":"Карпачо з яловичини"}', '{"en":"Thinly sliced beef, rocket, parmesan, lemon.","uk":"Тонко нарізана яловичина, рукола, пармезан, лимон."}'),
  ('sea-bass', '{"en":"Sea bass","uk":"Сібас"}', '{"en":"Fillet on the grill, young potato, green asparagus.","uk":"Філе на грилі, молода картопля, зелена спаржа."}')
on conflict (slug) do nothing;

insert into dish_photos (dish_id, url, alt, position) values
  ((select id from dishes where slug = 'tartare'), '/photo/405926522_7104475096271096_3953933040856888595_n.jpg', '{"en":"Beef tartare","uk":"Тартар з яловичини"}', 1),
  ((select id from dishes where slug = 'salmon-canape'), '/photo/391749683_6945419922176615_5378591818517958663_n.jpg', '{"en":"Salmon canapé","uk":"Канапе з лососем"}', 1),
  ((select id from dishes where slug = 'lamb'), '/photo/242601968_4579572215428076_9110900407639068836_n.jpg', '{"en":"Slow-cooked lamb","uk":"Томлена баранина"}', 1),
  ((select id from dishes where slug = 'panna-cotta'), '/photo/340845283_535135425228599_8845032591361743684_n.jpg', '{"en":"Panna cotta","uk":"Панакота"}', 1),
  ((select id from dishes where slug = 'bruschetta'), '/photo/311778332_5745341902184429_6099583531181056864_n.jpg', '{"en":"Mushroom bruschetta","uk":"Брускета з грибами"}', 1),
  ((select id from dishes where slug = 'shrimp-skewer'), '/photo/273831926_5059868067398486_6296733565879236204_n.jpg', '{"en":"Prawn skewer","uk":"Шпажка з креветкою"}', 1),
  ((select id from dishes where slug = 'profiteroles'), '/photo/271314426_4917171355001492_7229037114222721819_n.jpg', '{"en":"Profiteroles","uk":"Профітролі"}', 1),
  ((select id from dishes where slug = 'carpaccio'), '/photo/318538134_5908192102566074_7651453671171471328_n.jpg', '{"en":"Beef carpaccio","uk":"Карпачо з яловичини"}', 1),
  ((select id from dishes where slug = 'sea-bass'), '/photo/340746862_1171182390247699_451647443759496078_n.jpg', '{"en":"Sea bass","uk":"Сібас"}', 1)
on conflict do nothing;

insert into placements (dish_id, category_id, price, portion, position) values
  ((select id from dishes where slug = 'tartare'),
   (select c.id from categories c join menu_types m on m.id = c.menu_type_id where m.slug = 'furshet' and c.slug = 'cold'),
   450, '1 pc', 1),
  ((select id from dishes where slug = 'tartare'),
   (select c.id from categories c join menu_types m on m.id = c.menu_type_id where m.slug = 'banquet' and c.slug = 'cold'),
   1600, '120 g', 1),
  ((select id from dishes where slug = 'salmon-canape'),
   (select c.id from categories c join menu_types m on m.id = c.menu_type_id where m.slug = 'furshet' and c.slug = 'cold'),
   380, '1 pc', 2),
  ((select id from dishes where slug = 'carpaccio'),
   (select c.id from categories c join menu_types m on m.id = c.menu_type_id where m.slug = 'furshet' and c.slug = 'cold'),
   420, '1 pc', 3),
  ((select id from dishes where slug = 'bruschetta'),
   (select c.id from categories c join menu_types m on m.id = c.menu_type_id where m.slug = 'furshet' and c.slug = 'hot'),
   390, '1 pc', 1),
  ((select id from dishes where slug = 'shrimp-skewer'),
   (select c.id from categories c join menu_types m on m.id = c.menu_type_id where m.slug = 'furshet' and c.slug = 'hot'),
   480, '1 pc', 2),
  ((select id from dishes where slug = 'sea-bass'),
   (select c.id from categories c join menu_types m on m.id = c.menu_type_id where m.slug = 'furshet' and c.slug = 'hot'),
   520, '1 pc', 3),
  ((select id from dishes where slug = 'panna-cotta'),
   (select c.id from categories c join menu_types m on m.id = c.menu_type_id where m.slug = 'furshet' and c.slug = 'desserts'),
   350, '80 g', 1),
  ((select id from dishes where slug = 'profiteroles'),
   (select c.id from categories c join menu_types m on m.id = c.menu_type_id where m.slug = 'furshet' and c.slug = 'desserts'),
   320, '2 pcs', 2),
  ((select id from dishes where slug = 'carpaccio'),
   (select c.id from categories c join menu_types m on m.id = c.menu_type_id where m.slug = 'banquet' and c.slug = 'cold'),
   1400, '140 g', 2),
  ((select id from dishes where slug = 'salmon-canape'),
   (select c.id from categories c join menu_types m on m.id = c.menu_type_id where m.slug = 'banquet' and c.slug = 'cold'),
   1500, '130 g', 3),
  ((select id from dishes where slug = 'lamb'),
   (select c.id from categories c join menu_types m on m.id = c.menu_type_id where m.slug = 'banquet' and c.slug = 'main'),
   2400, '250 g', 1),
  ((select id from dishes where slug = 'sea-bass'),
   (select c.id from categories c join menu_types m on m.id = c.menu_type_id where m.slug = 'banquet' and c.slug = 'main'),
   2200, '220 g', 2),
  ((select id from dishes where slug = 'bruschetta'),
   (select c.id from categories c join menu_types m on m.id = c.menu_type_id where m.slug = 'banquet' and c.slug = 'main'),
   1200, '180 g', 3),
  ((select id from dishes where slug = 'panna-cotta'),
   (select c.id from categories c join menu_types m on m.id = c.menu_type_id where m.slug = 'banquet' and c.slug = 'desserts'),
   700, '150 g', 1),
  ((select id from dishes where slug = 'profiteroles'),
   (select c.id from categories c join menu_types m on m.id = c.menu_type_id where m.slug = 'banquet' and c.slug = 'desserts'),
   650, '3 pcs', 2)
on conflict (dish_id, category_id) do nothing;
