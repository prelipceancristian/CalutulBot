#!/bin/sh
CURRENT_PATH=`pwd`
PATH1=$CURRENT_PATH/Music/Misc
PATH2=$CURRENT_PATH/Music/Kanye
cd $CURRENT_PATH/Music

for elem in $(ls $PATH1);do
	echo $elem >> outputMisc.txt
done

for elem in $(ls $PATH2);do
	echo $elem >> outputKanye.txt
done

cd $CURRENT_PATH
node bot.js >> logs.log 2>> error.log
#node bot.js