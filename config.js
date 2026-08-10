/* ==========================================================================
   Bloodveil Dawn
   Reader Configuration
   ==========================================================================

   Semua data chapter disimpan di sini.

   Untuk menambah chapter baru:
   cukup tambahkan object baru ke array chapters.

   Reader navigation dan Continue Reading
   akan membaca data ini secara otomatis.

   ========================================================================== */

const readerConfig = {

    chapters: [

        {
            number: 1,

            title:
                "1st Dawn: Beast of Hell",

            url:
                "001.html",

        },


        {
            number: 2,

            title:
                "2nd Dawn: Beneath The Surface",

            url:
                "002.html",

            thumbnail:
                "images/002.jpg"
        },


        {
            number: 3,

            title:
                "3rd Dawn: A Silenced Warmth Amidst a Howling Storm",

            url:
                "003.html",

            thumbnail:
                "images/003.jpg"
        }

        /*
            Tambah chapter baru di sini.

            Contoh:

            {
                number: 4,

                title:
                    "4th Dawn: Chapter Title",

                url:
                    "chapter-4.html",

                thumbnail:
                    "images/chapter-4.jpg"
            }
        */

    ]

};