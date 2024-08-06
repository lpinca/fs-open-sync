#define NAPI_VERSION 1
#include <assert.h>
#include <node_api.h>
#include <stdlib.h>
#include <string.h>
#include <uv.h>

#define OK(call) assert((call) == napi_ok);

napi_value CreateError(napi_env env, int err, char *pathname) {
  napi_value code;
  OK(napi_create_string_utf8(env, uv_err_name(err), NAPI_AUTO_LENGTH, &code));

  napi_value message;
  OK(napi_create_string_utf8(env, uv_strerror(err), NAPI_AUTO_LENGTH,
                             &message));

  napi_value error_number;
  OK(napi_create_int32(env, err, &error_number));

  napi_value path;
  OK(napi_create_string_utf8(env, pathname, NAPI_AUTO_LENGTH, &path));

  napi_value syscall;
  OK(napi_create_string_utf8(env, "open", NAPI_AUTO_LENGTH, &syscall));

  napi_value error;
  OK(napi_create_error(env, code, message, &error));

  OK(napi_set_named_property(env, error, "errno", error_number));
  OK(napi_set_named_property(env, error, "path", path));
  OK(napi_set_named_property(env, error, "syscall", syscall));

  return error;
}

napi_value Open(napi_env env, napi_callback_info info) {
  size_t argc = 3;
  napi_value argv[3];

  OK(napi_get_cb_info(env, info, &argc, argv, NULL, NULL));

  char *buf;
  size_t len;
  OK(napi_get_buffer_info(env, argv[0], (void **)&buf, &len));

  int32_t flags;
  OK(napi_get_value_int32(env, argv[1], &flags));

  int32_t mode;
  OK(napi_get_value_int32(env, argv[1], &mode));

  uv_fs_t req;
  char *path = (char *)malloc(len + 1);
  memcpy(path, buf, len);
  path[len] = '\0';

  int file = uv_fs_open(NULL, &req, path, flags, mode, NULL);
  uv_fs_req_cleanup(&req);

  if (file < 0) {
    napi_value error = CreateError(env, file, path);
    OK(napi_throw(env, error));
  }

  free(path);

  napi_value result;
  OK(napi_create_int32(env, file, &result));

  return result;
}

napi_value Init(napi_env env, napi_value exports) {
  napi_value open;
  OK(napi_create_function(env, NULL, 0, Open, NULL, &open));

  OK(napi_set_named_property(env, exports, "open", open));

  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
