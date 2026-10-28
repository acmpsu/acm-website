"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * Login "ASCII Meadow" backdrop, matching the Figma source.
 *
 * Every layer lives in a single 1920×1080 frame:
 *   1. the supplied landscape photo (object-cover + 12px blur)
 *   2. an atmospheric veil (two flat tints)
 *   3. a monospace glyph "contours" layer (IBM Plex Mono, 18px)
 *
 * The frame is rendered at native size and scaled by one factor, so the photo
 * and the glyph text stay locked together exactly as designed.
 */

const FRAME_W = 1920;
const FRAME_H = 1080;

// Transcribed verbatim from Figma node 487:169 ("Glyph contours / angular meadow").
const GLYPH_CONTOURS = `
\\
|


              >|x+>                                                                                                        <~->
               *=x+                                                                                            > ~-   -^|\\/ <
               +* %/ <\\++=\\                                     >|~                                          <~/+=\\/ =x/^<~
           ~->|x#^&%+ =x/>|\\                    /^|~           ~   ~-                                    ^=x/ |\\++&x++<    \\
        ~++=%+ |\\/>    |x +<                                       <                                   |x+^|\\-    ^|\\     ><
        |\\    -^=x *|\\/+=~                      <\\/                >|\\-                             |\\++=~   ~     += ->    <
         |x *=\\-^&~+^  -                          ~->                <\\/  ~                           ~+^<~/^       ^=x+^ \\/^=x+
             ^| -+|x+><                                                ~/^|\\/^|\\+ |\\/><~           ~/^= /^      -  ~ ><  ^|\\- <\\
               |x+^ %+   -^                                                 ~->       >            <\\/^|         /+<     ->|\\-
                 x#>&x/ |\\/+                                                                 ~/^=x++ x+><~       \\/          ~-
          ~/^|\\/ |x/^|      ^                                                              ->     ~/*&\\          |\\            -
          =  >   >=x +|  ^=\\                                                                      =%#^       > ~ >=\\/^< -      ~
~-   ->< -^=\\ >   +&~#^  />                                                                     \\++=\\      <\\/^|     /^|x/> ~  <
<~   ~ >   >|\\    ++ x+ |~                                                                     >=x/       /^<~/^|\\   \\/>|\\/^=~-
              ~-> \\/  x/^|                                                                 ->  /+=            ~   \\++|   <\\/^=x/
                -^|x  =x+ <                                                                     +*|          ><\\+ =x-  \\ ^ ~ +=x
                ~/ |\\  &x/^                                                                     x#^        |\\/^=x++   + \\  <\\-^|
                 x/>|  ^&x/                                                                    ^&x       x#*=x ^<   <\\ ^  -
                 =x/+| -+= /                     |\\/^|x+^|~ ^|\\-                               /*&x/ <\\ *&%#*&x  <  ^|   <
                 >= #*|%#+<    \\/^<\\/^=x+ &x+*&%#*&% *&x/>  -^= #+                               *&%#*&%#+= /^|\\   x+^ \\-
                     #+ x  |%#*&%# &%#*&%#*&% *&%+>|\\/>< -  ~   x#+                               +& #*&x       ~/^ \\-+=
<\\/^<                \\+>&\\+ &%++|x+*&x >  -+| />  -><~-><\\/  ~   \\#+                                              - | #*       >
>|\\     ^   ^|  ^<    x *=%#^|~             ><   =x ^  ->=x/+&\\  |%/^|\\/^|\\ ^|x++=x++= ++|\\++=\\/^ x++=x+^|\\/ |\\++|  *|x +=\\/^|\\/
/           - < -> \\- |~ +&x                /   -*|   |\\  =x#+  /^&\\ +=x++=x++= ++=x++=x++ x++=x++=x+ =x++=x++|\\ >|x# =x/^| /^|\\
x/ <~   \\  |  ^=\\ +=x++|~++                < /> \\# < /+   ^=% > ~/+ x++= +^|\\/^|\\/^ \\/^<~-><~/ |~      <           < -^|
=x/^|\\++=x ^<\\/^|x++< +^< -          ~ >|    ~  |%-^|x ^    < / | +>=\\-><\\/> \\->              -><   <\\- <~           \\ >   ><
>|\\ ^=x#*=x-    ><        ~-><\\/>       >|\\ ^|  +&\\++|x+    ^ x/*& ++                    <      >   ^|  ^|\\/^|\\/^ x/^<~/+=x+ =x/
  <\\/^= /^|~-    >    <~    -      \\/ <  >=\\/+  +*| /+=x+> ~/  %- |x/                                               - < -><   <
                                       |\\++  +  x#      x+    +&\\+ =
                                                 x  =x+ =\\   \\+^=x+
                                                   / =x#+                                                         \\
                                                 ^=   |x     ^


                                                                                         = /^
                                                                                                                        /
                                                                                                                       |      +|
                                                                                                                        |    x+

                                                                                                                             ^=x


`;

export function AuthMeadow() {
  const ref = useRef<HTMLDivElement>(null);

  // Scale the frame by width so the backdrop is 1:1 with the Figma artboard at
  // 1920px wide and scales proportionally with the window. The height/0.5 terms
  // only clamp up to cover a vertical gap on unusually short, wide windows.
  //
  // We measure the viewport (not the parent element) so the backdrop only
  // responds to window resizes. Measuring the parent would also react to the
  // sign-in card growing/shrinking between modes, visibly rescaling the photo.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const apply = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const scale = Math.max(width / FRAME_W, height / FRAME_H, 0.5);
      el.style.transform = `translate(-50%, -50%) scale(${scale})`;
    };

    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 origin-center"
      style={{
        width: FRAME_W,
        height: FRAME_H,
        transform: "translate(-50%, -50%) scale(1)",
      }}
    >
      <Image
        src="/resources/login/meadow.png"
        alt=""
        fill
        priority
        sizes="1920px"
        className="object-cover blur-[12px] [inset:-24px] !h-[calc(100%+48px)] !w-[calc(100%+48px)]"
      />
      <div className="auth-meadow-veil absolute inset-0" />
      <div className="auth-meadow-glyphs absolute inset-0">{GLYPH_CONTOURS}</div>
    </div>
  );
}
