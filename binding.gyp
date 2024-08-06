{
  'variables': {
    'openssl_fips': ''
  },
  'targets': [
    {
      'target_name': 'binding',
      'sources': ['src/binding.c'],
      'conditions': [
        ["OS=='mac'", {
          'xcode_settings': {
            'MACOSX_DEPLOYMENT_TARGET': '10.7',
            'OTHER_CFLAGS': ['-arch arm64'],
            'OTHER_LDFLAGS': ['-arch arm64']
          }
        }]
      ]
    }
  ]
}
