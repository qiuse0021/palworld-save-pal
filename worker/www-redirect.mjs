const WWW_HOSTNAME = "www.palworldsaveeditor.org";
const CANONICAL_HOSTNAME = "palworldsaveeditor.org";

export default {
  fetch(request) {
    const target = new URL(request.url);

    if (target.hostname !== WWW_HOSTNAME) {
      return new Response("Not Found", { status: 404 });
    }

    target.protocol = "https:";
    target.host = CANONICAL_HOSTNAME;

    return Response.redirect(target, 301);
  },
};
