#
# Be sure to run `pod lib lint Syr.podspec' to ensure this is a
# valid spec before submitting.
#
# Any lines starting with a # are optional, but their use is encouraged
# To learn more about a Podspec see http://guides.cocoapods.org/syntax/podspec.html
#

Pod::Spec.new do |s|
  s.name             = 'Syr'
  s.version          = '1.3.2-alpha'
  s.summary          = 'minimally obtrusive reactisque view engine, aimed at native developers'

# This description is used to generate tags and improve search results.
#   * Think: What does it do? Why did you write it? What is the focus?
#   * Try to keep it short, snappy and to the point.
#   * Write the description between the DESC delimiters below.
#   * Finally, don't worry about the indent, CocoaPods strips it!

  s.description      = 'Build dynamic UIs for Native Platforms, with less than 200kb of extra libraries! The goal of this library is provide Native SDK developers with the benefits of the React Native Eco System, with a much smaller footprint and reduced complexity.'

  s.homepage         = 'https://dmikey.github.io/syr/'
  s.screenshots     = 'https://user-images.githubusercontent.com/328000/33408997-0ceecb7e-d52e-11e7-8f63-ca2f984751f7.gif'
  s.license          = { :type => 'MIT', :file => 'LICENSE' }
  s.author           = { 'Derek Anderson' => 'dereanderson@paypal.com' }
  s.source           = { :git => 'https://github.com/dmikey/syr.git', :tag => s.version.to_s }
  s.social_media_url = 'https://twitter.com/SyrSDK'

  s.ios.deployment_target = '8.0'

  s.source_files = 'ios/SyrNative/SyrNative/**/*'

  # s.resource_bundles = {
  #   'Syr' => ['Syr/Assets/*.png']
  # }

  # s.public_header_files = 'Pod/Classes/**/*.h'
  # s.frameworks = 'UIKit', 'MapKit'
  # s.dependency 'AFNetworking', '~> 2.3'
end
