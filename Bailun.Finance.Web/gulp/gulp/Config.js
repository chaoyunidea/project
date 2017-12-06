var dev = "dev/",
 dist = "dist/",
 styles_dev = "Styles/dev/",
 styles_dist = "Styles/dist/",

 scripts_dev = "Scripts/dev/",
 scripts_dist = "Scripts/dist/",

 cleanSrc = "Styles/dist/",
 cleanOnSrc = "Styles/dist/",


gulpdevHreadFooter = "Styles/glup/HreadFooter/**/*.less",
gulpdistHreadFooter = "Styles/dist/Public",

gulpdevPublic = "Styles/glup/public.less",
gulpdistPublic = "Styles/dist/Public";



module.exports = {
     all:dev,
     less:{
     	all: styles_dev + "**/*.less",
     	dev: styles_dev + "**/*.less", //开发的less地址
     	dist: styles_dist ,      //编译的less地址
         settings:{     //编译less过程需要的配置，可以为空

         }
     },
     css:{
     	all: styles_dev + "**/*.css",
     	dev: styles_dev + "**/*.css", //开发的css地址
     	dist: styles_dist + "css",      //编译的css地址
         settings:{     //编译css过程需要的配置，可以为空

         }
     },
     js:{
     	all: scripts_dev + "**/*.js",
     	dev: scripts_dev + "**/*.js", //开发的js地址
     	dist: scripts_dist + "js",      //编译的js地址
         settings:{     //编译js过程需要的配置，可以为空

         }
     },
     img:{
         dev: dev + "less/**/*.less", //开发的less地址
         dist: dist + "less/**",      //编译的less地址
         settings:{     //便宜less过程需要的配置，可以为空

         }
     },

     clean:{
         csssrc: cleanSrc,
         jssrc: scripts_dist,
         gulpminsrc: "Scripts/gulpmin/",
     	noClean: "!" + cleanOnSrc + "**/!(Public)*"
     },
     gulp: {
         HreadFooter: { dev: gulpdevHreadFooter, dist: gulpdistHreadFooter },
         Public: { dev: gulpdevPublic, dist: gulpdistPublic }
	}

}

