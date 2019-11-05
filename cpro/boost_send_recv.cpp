// g++ -std=c++11 c_pro.cpp -lboost_thread -lboost_system -lpthread
#include <boost/asio/io_service.hpp>
//#include <boost/asio/steady_timer.hpp>
#include <boost/asio.hpp>
#include <boost/thread.hpp>
#include <chrono>
#include <iostream>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <thread>
#include <csignal>

#define DLT_BYTES_TO_WORD(x0, x1) (uint16_t((x1) << 8 | (x0)))
#define DLT_BYTES_TO_LONG(x0, x1, x2, x3) (uint32_t((x3) << 24 | (x2) << 16 | (x1) << 8 | (x0)))

#if 0
static char* remote_address = "10.0.2.15";
static char* local_address = "192.168.1.12";
#else
static char* local_address = "127.0.0.1";
static char* remote_address = "127.0.0.1";
#endif

class Dlt
{
public:
    Dlt():
        work_(std::make_shared<boost::asio::io_service::work>(io_)),
        io_thread_ (&Dlt::io_run, this) {}

    ~Dlt()
    {
        work_.reset();
        io_.stop();
        io_thread_.join();
        std::cout << "deconstructed" << std::endl;
    }

    static void writeFile() {
        int cnt = 0;
        int wcn = 0;
        FILE *fp = NULL;
        FILE *fo = NULL;
        char *str0 = "0234\n\n";
        char *str1 = "12567\n";
        char *str2 = "223\n45\n";
        char *str3 = "32345\n";
        char *str4 = "42345\n";
        char filename[20] = "/tmp/tmp.XXXXXX";
        char pBuf[512*1024*7];

        struct iovec *iov;
        ssize_t nwritten;

        cnt = 5;
        wcn = 3;

        iov = (struct iovec*)malloc(cnt*sizeof(struct iovec));
        iov[0].iov_base = str0;
        iov[0].iov_len = strlen(str0);
        iov[1].iov_base = str1;
        iov[1].iov_len = strlen(str1);
        iov[2].iov_base = str2;
        iov[2].iov_len = strlen(str2);
        iov[3].iov_base = str3;
        iov[3].iov_len = strlen(str3);
        iov[4].iov_base = str4;
        iov[4].iov_len = strlen(str4);

        int fd = mkstemp(filename);

        if (fd) {
            nwritten = writev(fd, &(iov[1]), wcn);
            nwritten = writev(STDOUT_FILENO, &iov[1], wcn);
            printf("---%ld bytes written to file: %s.\n", nwritten, filename);
        }
        /*
        fo = fopen(filename, "w");

        fp = fopen("msg", "r");
        if (fp)
        {
            long long i = 0;
            int ch = 0;
            while (!feof(fp))
            {
                ch = fgetc(fp);
                if (ch == EOF)
                    break;
                pBuf[i] = ch;
                i++;
            }
            pBuf[i] = 0;
            //printf("write str:%s, len: %lld to buffer.\n", pBuf, i);
            printf("write str len: %lld to buffer.\n", i);
            fwrite(pBuf, sizeof(char), i, fo);
            fclose(fo);
            fclose(fp);
        }
        */
    }

    static void uploadHandle(const boost::system::error_code& e, boost::asio::deadline_timer* pt) {
        (void)e;
        std::cout << "uploadHandle" << std::endl;
        writeFile();

        //pt->expires_at(pt->expires_at() + boost::posix_time::seconds(5));
        //pt->async_wait(boost::bind(uploadHandle, boost::asio::placeholders::error, pt));
    }

    void requestParse(std::vector<std::uint8_t> receive_buffer) {
        unsigned msgType = unsigned(receive_buffer[0]);
        unsigned errCode = unsigned(receive_buffer[1]);
        uint32_t actionID = DLT_BYTES_TO_LONG(receive_buffer[4],receive_buffer[5], receive_buffer[6], receive_buffer[7]);
        uint32_t commandID = DLT_BYTES_TO_LONG(receive_buffer[8],receive_buffer[9], receive_buffer[10], receive_buffer[11]);
        unsigned target = unsigned(receive_buffer[12]);
        unsigned startStop = unsigned(receive_buffer[13]);
        uint16_t length = DLT_BYTES_TO_WORD(receive_buffer[24],receive_buffer[25]);
        uint16_t upload = DLT_BYTES_TO_WORD(receive_buffer[26],receive_buffer[27]);

        boost::asio::deadline_timer uploadTimer(io_, boost::posix_time::seconds(upload));
        uploadTimer.async_wait(boost::bind(uploadHandle, boost::asio::placeholders::error, &uploadTimer));

        std::cout << "parse msg Type(1Byte):" << msgType << ", Error Code(1Byte):"<< errCode << std::endl;
        std::cout << "parse ActionID(4Byte):" << actionID << ", CommandID(4Byte):"<< commandID << std::endl;
        std::cout << "parse Target(1Byte):" << target << ", Start Stop(1Byte):"<< startStop << std::endl;
        std::cout << "parse Length(2Byte):" << length << ", Upload Frequency(2Byte):"<< upload << std::endl;
        for (int i=0; i<length; i++) {
            uint16_t signal = DLT_BYTES_TO_WORD(receive_buffer[28 + 4*i], receive_buffer[29 + 4*i]);
            uint16_t Frequency = DLT_BYTES_TO_WORD(receive_buffer[30 + 4*i], receive_buffer[31 + 4*i]);
            std::cout << "parse signal(2Byte):" << signal << ", Sample Frequency(2Byte):"<< Frequency << std::endl;
        }
        std::cout << std::endl;
    }

    void startRunning() {

        boost::asio::ip::udp::endpoint local_ep(boost::asio::ip::address_v4::from_string("127.0.0.1"), 8087);
        boost::asio::ip::udp::socket udp_socket(io_, local_ep);
        //    boost::asio::ip::udp::endpoint(boost::asio::ip::udp::v4(), 8087));
        udp_socket.set_option(boost::asio::socket_base::reuse_address(true));
        udp_socket.set_option(boost::asio::socket_base::linger(true, 0));

        std::thread receive_thread([&]() {
            std::atomic<bool> keep_receiving(true);
            std::function<void()> receive;
            std::vector<std::uint8_t> receive_buffer(512);

            std::cout << "-----recv_thread:" << boost::this_thread::get_id() << std::endl;
            const std::function<void(const boost::system::error_code&, std::size_t)> receive_cbk = [&](
                const boost::system::error_code& error, std::size_t bytes_transferred) {

                requestParse(receive_buffer);

                if (error) {
                    keep_receiving = false;
                    return;
                }

                if (!error && keep_receiving) {
                    receive();
                }
            };

            receive = [&]() {
                udp_socket.async_receive(boost::asio::buffer(receive_buffer, receive_buffer.capacity()), receive_cbk);
            };

            receive();
            while(keep_receiving) {
                std::this_thread::sleep_for(std::chrono::milliseconds(1000));
            }
        }); // receive_thread

        std::thread send_thread([&]() {
        try {
            std::uint8_t its_subscribe_message[] = {
                0x01, 0x08, 0x00, 0x00, // [0]messageTpye, errorCode, R, R
                0x11, 0x00, 0x00, 0x00, // [4]Action ID
                0x01, 0x00, 0x00, 0x00, // [8]Cmd ID
                0x02, 0x01, 0x00, 0x00, // [12]Target,startStop,Priority,R
                0x57, 0x57, 0x57, 0x00, // [16]Expiry 8 bytes
                0x57, 0x57, 0x57, 0x00,
                0x02, 0x00, 0x04, 0x00, // [24]payload length & Frequency
                0x03, 0x00, 0x12, 0x00, // [28]payload signal3, 16s
                0x05, 0x00, 0x18, 0x00  // [32]payload signal5, 24s
            };

            boost::asio::ip::address its_local_address =
                    boost::asio::ip::address::from_string(std::string(local_address));
            std::memcpy(&its_subscribe_message[20], &its_local_address.to_v4().to_bytes()[0], 4);

            boost::asio::ip::udp::socket::endpoint_type target_sd(
                    boost::asio::ip::address::from_string(std::string(remote_address)), 8087);
            std::cout << "-----send thread:" << boost::this_thread::get_id() << std::endl;
#if 0
            for (int var = 0; var < 3; ++var) {
                udp_socket.send_to(boost::asio::buffer(its_subscribe_message), target_sd);
                ++its_subscribe_message[8];
            }
#else
            while (true) {
                getchar();
                udp_socket.send_to(boost::asio::buffer(its_subscribe_message), target_sd);
                ++its_subscribe_message[8];
            }
#endif
        } catch (...) {
            std::cout << "send data error" << std::endl;
        }
        }); // send_thread

        send_thread.join();
        std::cout << "-----startThread:" << boost::this_thread::get_id() << std::endl;
        std::cout << "-----send_thread joined." << std::endl;
        receive_thread.join();
        std::cout << "recv_thread joined." << std::endl;
    }

    void io_run()
    {
        std::cout << "-----io_run thread:" << boost::this_thread::get_id() << std::endl;
        io_.run();
    }

    boost::asio::io_service io_;
    std::shared_ptr<boost::asio::io_service::work> work_;
    std::thread io_thread_;
};

int main() {

    Dlt dlt;
    dlt.startRunning();


    return 0;
}

